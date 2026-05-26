import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { ImagesSection } from "./ImagesSection";
import type { FormInputs } from "./ProductForm";
import { describe, expect, it, vi } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("lucide-react", () => ({
  Upload: () => <svg data-testid="upload-icon" />,
  X: () => <svg data-testid="x-icon" />,
}));

// Mock URL.createObjectURL
globalThis.URL.createObjectURL = vi.fn((file: File) => `blob:mock/${file.name}`);

// ─── Wrapper ──────────────────────────────────────────────────────────────────

interface WrapperProps {
  isEdit?: boolean;
  images?: { name: string; url: string }[];
}

/**
 * Renders ImagesSection connected to a real react-hook-form instance.
 * This avoids mocking the hook and tests the full integration.
 */
const Wrapper = ({ isEdit = false, images }: WrapperProps) => {
  const { control, getValues, setValue } = useForm<FormInputs>({
    defaultValues: { files: [], images: images ?? [] },
  });

  return (
    <ImagesSection
      control={control}
      getValues={getValues}
      setValue={setValue}
      isEdit={isEdit}
      images={images}
    />
  );
};

const renderComponent = (props: WrapperProps = {}) => {
  cleanup();
  render(<Wrapper {...props} />);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const makeFile = (name = "photo.jpg") =>
  new File(["content"], name, { type: "image/jpeg" });

const makeFileList = (files: File[]): FileList => {
  return {
    ...files,
    length: files.length,
    item: (i: number) => files[i],
    [Symbol.iterator]: files[Symbol.iterator].bind(files),
  } as unknown as FileList;
};

const dropFiles = (dropzone: HTMLElement, files: File[]) => {
  const dt = { files: makeFileList(files) } as unknown as DataTransfer;

  act(() => {
    fireEvent.dragEnter(dropzone, { dataTransfer: dt });
    fireEvent.dragOver(dropzone, { dataTransfer: dt });
    fireEvent.drop(dropzone, { dataTransfer: dt });
  });
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("ImagesSection", () => {

  // ── Static structure ───────────────────────────────────────────────────

  describe("static structure", () => {
    it("renders the section heading", () => {
      renderComponent();
      expect(screen.getByText("Images")).toBeInTheDocument();
    });

    it("renders the drag-and-drop zone with helper texts", () => {
      renderComponent();
      expect(screen.getByText("Drag images here")).toBeInTheDocument();
      expect(screen.getByText("or click to upload")).toBeInTheDocument();
      expect(screen.getByText(/PNG, JPG, WebP/i)).toBeInTheDocument();
    });

    it("renders the upload icon", () => {
      renderComponent();
      expect(screen.getByTestId("upload-icon")).toBeInTheDocument();
    });

    it("renders a hidden file input that accepts images", () => {
      renderComponent();

      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeInTheDocument();
      expect(fileInput.accept).toBe("image/*");
      expect(fileInput.multiple).toBe(true);
    });
  });

  // ── Current images (isEdit) ────────────────────────────────────────────

  describe("existing images", () => {
    const images = [
      { name: "img1.jpg", url: "https://example.com/img1.jpg" },
      { name: "img2.jpg", url: "https://example.com/img2.jpg" },
    ];

    it("renders current images section when isEdit is true", () => {
      renderComponent({ images, isEdit: true });
      expect(screen.getByText("Current Images")).toBeInTheDocument();
    });

    it("renders one image card per existing image", () => {
      renderComponent({ images, isEdit: true });
      const imgs = screen.getAllByRole("img");
      // Only the existing-images imgs (no selected files yet)
      expect(imgs).toHaveLength(2);
    });

    it("renders image URLs as captions", () => {
      renderComponent({ images, isEdit: true });
      expect(screen.getByText(images[0].url)).toBeInTheDocument();
      expect(screen.getByText(images[1].url)).toBeInTheDocument();
    });

    it("renders a remove button for each existing image", () => {
      renderComponent({ images, isEdit: true });
      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("removes the correct image when its delete button is clicked", () => {
      renderComponent({ images, isEdit: true });

      // Click the first remove button
      const buttons = screen.getAllByRole("button");
      act(() => {
        fireEvent.click(buttons[0]);
      });

      // First image URL should be gone; second should remain
      expect(screen.queryByText(images[0].url)).not.toBeInTheDocument();
      expect(screen.getByText(images[1].url)).toBeInTheDocument();
    });

    it("does not render current images section when no images are passed", () => {
      renderComponent({ isEdit: true });
      expect(screen.queryByText("Current Images")).not.toBeInTheDocument();
    });
  });

  // ── Drag active state ──────────────────────────────────────────────────

  describe("drag active styling", () => {
    it("applies active styles on dragenter", () => {
      renderComponent();
      const dropzone = screen.getByTestId('dropzone');

      act(() => fireEvent.dragEnter(dropzone));

      expect(dropzone.className).toMatch(/border-blue-400/);
    });

    it("removes active styles on dragleave", () => {
      renderComponent();
      const dropzone = screen.getByText("Drag images here").closest("div")!
        .parentElement!;

      act(() => fireEvent.dragEnter(dropzone));
      act(() => fireEvent.dragLeave(dropzone));

      expect(dropzone.className).not.toMatch(/border-blue-400/);
    });
  });

  // ── File selection via input ───────────────────────────────────────────

  describe("file input selection", () => {
    it("shows 'Images to upload' section after selecting files", () => {
      renderComponent();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      act(() => {
        fireEvent.change(input, {
          target: { files: makeFileList([makeFile("new.jpg")]) },
        });
      });

      expect(screen.getByText("Images to upload")).toBeInTheDocument();
    });

    it("renders a preview image for each selected file", () => {
      renderComponent();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const files = [makeFile("a.jpg"), makeFile("b.jpg")];

      act(() => {
        fireEvent.change(input, { target: { files: makeFileList(files) } });
      });

      const imgs = screen.getAllByRole("img");
      expect(imgs).toHaveLength(2);
    });

    it("sets the blob URL as the image src", () => {
      renderComponent();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = makeFile("preview.jpg");

      act(() => {
        fireEvent.change(input, { target: { files: makeFileList([file]) } });
      });

      const img = screen.getByRole("img") as HTMLImageElement;
      expect(img.src).toBe("blob:mock/preview.jpg");
    });

    it("renders the filename as caption for each selected file", () => {
      renderComponent();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;

      act(() => {
        fireEvent.change(input, {
          target: { files: makeFileList([makeFile("caption.jpg")]) },
        });
      });

      expect(screen.getByText("caption.jpg")).toBeInTheDocument();
    });

    it("removes the correct file when its delete button is clicked", () => {
      renderComponent();
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const files = [makeFile("keep.jpg"), makeFile("remove.jpg")];

      act(() => {
        fireEvent.change(input, { target: { files: makeFileList(files) } });
      });

      // Two remove buttons — click the second one
      const buttons = screen.getAllByRole("button");
      act(() => fireEvent.click(buttons[1]));

      expect(screen.queryByText("remove.jpg")).not.toBeInTheDocument();
      expect(screen.getByText("keep.jpg")).toBeInTheDocument();
    });
  });

  // ── Drag and drop ──────────────────────────────────────────────────────

  describe("drag and drop", () => {
    it("shows 'Images to upload' section after dropping files", () => {
      renderComponent();
      const dropzone = screen.getByText("Drag images here").closest("div")!
        .parentElement!;

      dropFiles(dropzone, [makeFile("dropped.jpg")]);

      expect(screen.getByText("Images to upload")).toBeInTheDocument();
    });

    it("renders dropped files as previews", () => {
      renderComponent();
      const dropzone = screen.getByText("Drag images here").closest("div")!
        .parentElement!;

      dropFiles(dropzone, [makeFile("d1.jpg"), makeFile("d2.jpg")]);

      expect(screen.getAllByRole("img")).toHaveLength(2);
    });

    it("resets drag active state after drop", () => {
      renderComponent();
      const dropzone = screen.getByText("Drag images here").closest("div")!
        .parentElement!;

      dropFiles(dropzone, [makeFile("file.jpg")]);

      expect(dropzone.className).not.toMatch(/border-blue-400/);
    });
  });

  // ── Mixed existing + new files ─────────────────────────────────────────

  describe("existing images + new files together", () => {
    it("shows both sections simultaneously", () => {
      const images = [{ name: "old.jpg", url: "https://example.com/old.jpg" }];
      renderComponent({ images, isEdit: true });

      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      act(() => {
        fireEvent.change(input, {
          target: { files: makeFileList([makeFile("new.jpg")]) },
        });
      });

      expect(screen.getByText("Current Images")).toBeInTheDocument();
      expect(screen.getByText("Images to upload")).toBeInTheDocument();
    });
  });
});