import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { BasicInformationSection } from "./BasicInformationSection";
import { useProductTypes } from "@/admin/hooks/useProductTypes";


vi.mock('@/admin/hooks/useProductTypes');
vi.mock('./DynamicForm', () => ({
  DynamicForm: () => <div data-testid="dynamic-form" />,
}));

const defaultProps = {
  register: vi.fn().mockReturnValue({}),
  errors: {},
  isEdit: false,
  selectedSchema: null,
  onSchemaChange: vi.fn(),
};

const mockSchema = { fields: [{ name: 'color', type: 'text' }] };

const mockProductTypes = [
  { id: '1', name: 'Electronics', schema: mockSchema },
  { id: '2', name: 'Clothing',    schema: null },
];

const renderComponent = (props = {}) => {
  cleanup();
  render(<BasicInformationSection {...defaultProps} {...props} />);
}

describe("BasicInformationSection", () => {

  beforeEach(() => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProductTypes,
    } as unknown as ReturnType<typeof useProductTypes>);
  });

  it('should render without crashing', () => {
    renderComponent();

    expect(screen.getByText("Product Information")).toBeInTheDocument();
  });

  it('llama onSchemaChange con el schema del tipo seleccionado', () => {
    const onSchemaChange = vi.fn();
    renderComponent({ onSchemaChange });
 
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });

    expect(onSchemaChange).toHaveBeenCalledWith(mockSchema);
  });

  it('llama onSchemaChange con null si se selecciona la opción vacía', () => {
    const onSchemaChange = vi.fn();
    renderComponent({ onSchemaChange });
 
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });
 
    expect(onSchemaChange).toHaveBeenCalledWith(null);
  });

  it('no muestra el select en modo edit', () => {
    renderComponent({ isEdit: true });
    expect(screen.queryByRole('combobox')).not.toBeInTheDocument();
  });
  
});
