import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TagsSection } from "./TagsSection";
import { useWatch } from "react-hook-form";

vi.mock('react-hook-form', () => ({
  useWatch: vi.fn()
}));

const mockedGetValues = vi.fn();
const mockedSetValue = vi.fn();

const mockedProps = {
  control: {},
  getValues: mockedGetValues,
  setValue: mockedSetValue
} as unknown as React.ComponentProps<typeof TagsSection>


const renderTags = (props: React.ComponentProps<typeof TagsSection>) => {
  cleanup();
  render(<TagsSection {...props} />)
}

describe('TagsSection', () => {

  beforeEach(() => {
    mockedSetValue.mockClear();
    mockedGetValues.mockClear();

    vi.mocked(useWatch).mockReturnValue([]);
    vi.mocked(mockedGetValues).mockReturnValue([]);
  });
  
  it('should render correctly', () => {
    renderTags(mockedProps);

    expect(screen.getByText('Tags')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render tag when one is already selected', () => {
    vi.mocked(useWatch).mockReturnValue(['Mocked Tag']);
    vi.mocked(mockedGetValues).mockReturnValue(['Mocked Tag']);  

    renderTags(mockedProps);

    expect(screen.getByText('Mocked Tag')).toBeInTheDocument();
  });

  it('should call addTag method when adding tag', () => {
    renderTags(mockedProps);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Fantasy' } });
    fireEvent.click(button);

    expect(mockedProps.setValue).toHaveBeenCalledWith('tags', ['Fantasy']);
  });

  it('should call setValue when removing a tag', () => {
    vi.mocked(useWatch).mockReturnValue(['Fantasy', 'Epic']);
    vi.mocked(mockedGetValues).mockReturnValue(['Fantasy', 'Epic']); 
    renderTags(mockedProps);

    const removeButtons = screen.getAllByRole('button');
    // first remove button for 'Fantasy'
    fireEvent.click(removeButtons[0]);

    expect(mockedProps.setValue).toHaveBeenCalledWith('tags', ['Epic']);
  });
});
