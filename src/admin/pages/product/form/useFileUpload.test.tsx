import { renderHook, act } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { useFileUpload } from "./useFileUpload";
import type { FormInputs } from "./ProductForm";
import { describe, expect, it, vi } from "vitest";

// Helper: renders the hook wired to a real react-hook-form instance
const setup = (defaultImages?: { name: string; url: string }[]) => {
  const { result: formResult } = renderHook(() =>
    useForm<FormInputs>({
      defaultValues: { files: [], images: defaultImages ?? [] },
    })
  );

  const { result } = renderHook(() =>
    useFileUpload({
      control: formResult.current.control,
      images: defaultImages,
      getValues: formResult.current.getValues,
      setValue: formResult.current.setValue,
    })
  );

  return { result, formResult };
};

// ─── Drag helpers ────────────────────────────────────────────────────────────

const makeDragEvent = (type: string): React.DragEvent => {
  const event = new Event(type, { bubbles: true }) as unknown as React.DragEvent;
  event.preventDefault = vi.fn();
  event.stopPropagation = vi.fn();
  return event;
};

const makeDropEvent = (files: File[]): React.DragEvent => {
  const event = makeDragEvent("drop");
  Object.defineProperty(event, "dataTransfer", {
    value: { files } as unknown as DataTransfer,
  });
  return event;
};

// ─── File helpers ─────────────────────────────────────────────────────────────

const makeFile = (name = "photo.jpg") =>
  new File(["content"], name, { type: "image/jpeg" });

const makeChangeEvent = (files: File[]): React.ChangeEvent<HTMLInputElement> => {
  const fileList = {
    ...files,
    length: files.length,
    item: (i: number) => files[i],
    [Symbol.iterator]: files[Symbol.iterator].bind(files),
  } as unknown as FileList;

  return {
    target: { files: fileList },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("useFileUpload", () => {
  // ── Initial state ────────────────────────────────────────────────────────

  describe("initial state", () => {
    it("returns dragActive as false", () => {
      const { result } = setup();
      expect(result.current.dragActive).toBe(false);
    });

    it("returns an empty selectedFiles array when form has no files", () => {
      const { result } = setup();
      expect(result.current.selectedFiles).toEqual([]);
    });

    it("returns existentImages from the images prop when form field is empty", () => {
      const images = [{ name: "img1.jpg", url: "https://example.com/img1.jpg" }];
      const { result } = setup(images);
      expect(result.current.existentImages).toEqual(images);
    });

    it("returns an empty existentImages array when no images prop is provided", () => {
      const { result } = setup();
      expect(result.current.existentImages).toEqual([]);
    });
  });

  // ── handleDrag ───────────────────────────────────────────────────────────

  describe("handleDrag", () => {
    it.each(["dragenter", "dragover"])(
      "sets dragActive to true on %s",
      (type) => {
        const { result } = setup();
        const event = makeDragEvent(type);

        act(() => result.current.handleDrag(event));

        expect(result.current.dragActive).toBe(true);
        expect(event.preventDefault).toHaveBeenCalled();
        expect(event.stopPropagation).toHaveBeenCalled();
      }
    );

    it("sets dragActive to false on dragleave", () => {
      const { result } = setup();

      act(() => result.current.handleDrag(makeDragEvent("dragenter")));
      expect(result.current.dragActive).toBe(true);

      act(() => result.current.handleDrag(makeDragEvent("dragleave")));
      expect(result.current.dragActive).toBe(false);
    });
  });

  // ── handleDrop ───────────────────────────────────────────────────────────

  describe("handleDrop", () => {
    it("resets dragActive to false after drop", () => {
      const { result } = setup();

      act(() => result.current.handleDrag(makeDragEvent("dragenter")));
      act(() => result.current.handleDrop(makeDropEvent([makeFile()])));

      expect(result.current.dragActive).toBe(false);
    });

    it("adds dropped files to the selectedFiles list", () => {
      const { result } = setup();
      const file = makeFile("dropped.jpg");

      act(() => result.current.handleDrop(makeDropEvent([file])));

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].name).toBe("dropped.jpg");
    });

    it("appends new files to existing ones instead of replacing them", () => {
      const { result } = setup();

      act(() => result.current.handleDrop(makeDropEvent([makeFile("first.jpg")])));
      act(() => result.current.handleDrop(makeDropEvent([makeFile("second.jpg")])));

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles.map((f) => f.name)).toEqual([
        "first.jpg",
        "second.jpg",
      ]);
    });

    it("does nothing when dataTransfer has no files", () => {
      const { result } = setup();
      const event = makeDragEvent("drop");
      event.dataTransfer = { files: null } as unknown as DataTransfer;

      act(() => result.current.handleDrop(event));

      expect(result.current.selectedFiles).toEqual([]);
    });
  });

  // ── handleFileChange ─────────────────────────────────────────────────────

  describe("handleFileChange", () => {
    it("adds files selected via input to the list", () => {
      const { result } = setup();
      const file = makeFile("input.jpg");

      act(() => result.current.handleFileChange(makeChangeEvent([file])));

      expect(result.current.selectedFiles).toHaveLength(1);
      expect(result.current.selectedFiles[0].name).toBe("input.jpg");
    });

    it("appends to existing files on multiple selections", () => {
      const { result } = setup();

      act(() => result.current.handleFileChange(makeChangeEvent([makeFile("a.jpg")])));
      act(() => result.current.handleFileChange(makeChangeEvent([makeFile("b.jpg")])));

      expect(result.current.selectedFiles).toHaveLength(2);
    });

    it("does nothing when the input has no files", () => {
      const { result } = setup();
      const event = { target: { files: null } } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => result.current.handleFileChange(event));

      expect(result.current.selectedFiles).toEqual([]);
    });
  });

  // ── mixed scenarios ──────────────────────────────────────────────────────

  describe("mixed drop + input selections", () => {
    it("accumulates files from both drag-and-drop and file input", () => {
      const { result } = setup();

      act(() => result.current.handleDrop(makeDropEvent([makeFile("dropped.jpg")])));
      act(() => result.current.handleFileChange(makeChangeEvent([makeFile("input.jpg")])));

      expect(result.current.selectedFiles).toHaveLength(2);
      expect(result.current.selectedFiles.map((f) => f.name)).toEqual([
        "dropped.jpg",
        "input.jpg",
      ]);
    });
  });
});