import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { CategoriesSection } from "./CategoriesSection";
import { useCategories } from "@/admin/hooks/useCategories";
import { useWatch } from "react-hook-form";

vi.mock('@/admin/hooks/useCategories');

vi.mock('react-hook-form', () => ({
  useWatch: vi.fn()
}));

const mockedGetValues = vi.fn()
const mockedSetValue = vi.fn()

const mockedProps = {
  control: {},
  getValues: mockedGetValues,
  setValue: mockedSetValue
} as unknown as React.ComponentProps<typeof CategoriesSection>;

const renderCategories = (props: React.ComponentProps<typeof CategoriesSection>) => {
  cleanup();
  render(<CategoriesSection {...props} />)
}

describe('CategoriesSection', () => {

  beforeEach(() => {
    mockedSetValue.mockClear();
    mockedGetValues.mockClear();

    vi.mocked(useWatch).mockReturnValue([]);
    vi.mocked(mockedGetValues).mockReturnValue([]);

    vi.mocked(useCategories).mockReturnValue({
      data: [
        {id: '1', name: 'Mocked Category 1'},
        {id: '2', name: 'Mocked Category 2'},
        {id: '3', name: 'Mocked Category 3'},
      ]
    } as unknown as ReturnType<typeof useCategories>)
  });

  it('should render correctly', () => {
    renderCategories(mockedProps);

    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should render category tag when one is already selected', () => {
    vi.mocked(useWatch).mockReturnValue([{ id: '3', name: 'Mocked Category 3' }]);
    vi.mocked(mockedGetValues).mockReturnValue([{ id: '3', name: 'Mocked Category 3' }]);  

    renderCategories(mockedProps);

    expect(screen.getByText('Mocked Category 3')).toBeInTheDocument();
  });

  it('should call setValue when selecting a category', async () => {
    const triggerButton = document.querySelector('[data-slot="input-group-button"]');
    fireEvent.click(triggerButton!);

    const option = await screen.findByText('Mocked Category 2');
    fireEvent.click(option);

    expect(mockedSetValue).toHaveBeenCalledWith('categories', [{id: '2', name: 'Mocked Category 2'}]);
  });
});