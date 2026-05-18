import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BasicInformationSection } from "./BasicInformationSection";
import { useProductTypes } from "@/admin/hooks/useProductTypes";


vi.mock('@/admin/hooks/useProductTypes');
vi.mock('./DynamicForm', () => ({
  DynamicForm: () => <div data-testid="dynamic-form" />,
}));

const mockedProps = {
  register: vi.fn().mockReturnValue({}),
  errors: {},
  isEdit: false,
  selectedSchema: null,
  onSchemaChange: vi.fn(),
};

const mockProductTypes = [
  { id: '1', name: 'Electronics', schema: {} },
  { id: '2', name: 'Clothing',    schema: {} },
];

const renderComponent = (props: React.ComponentProps<typeof BasicInformationSection>) => {
  cleanup();
  render(<BasicInformationSection {...props} />);
}

describe("BasicInformationSection", () => {

  beforeEach(() => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProductTypes,
    } as unknown as ReturnType<typeof useProductTypes>);
  });

  it('should render without crashing', () => {
    renderComponent(mockedProps);

    expect(screen.getByText("Product Information")).toBeInTheDocument();
    expect(screen.getByText('Product Type')).toBeDefined();
  });

  it('should render fields when on edit mode', () => {
    renderComponent({...mockedProps, isEdit: true, selectedSchema: {} });

    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Price ($)')).toBeDefined();
    expect(screen.getByText('Stock')).toBeDefined();
  });

  it('should call onSchemaChange when selecting a type', () => {
    renderComponent(mockedProps);
 
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    expect(mockedProps.onSchemaChange).toHaveBeenCalled();
  });

  it('should call onSchemaChange with null if selecting empty option', () => {
    renderComponent(mockedProps);
 
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
 
    expect(mockedProps.onSchemaChange).toHaveBeenCalledWith(null);
  });

  it('should not show Product Type select when in edit mode', () => {
    renderComponent({...mockedProps, isEdit: true });

    expect(screen.getByText('Product Type')).toBeDefined();
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
  
});
