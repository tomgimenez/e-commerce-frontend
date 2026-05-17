import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductForm } from "./ProductForm";
import type { ProductUI } from "@/interfaces/product.interface";
import { useProductTypes } from "@/admin/hooks/useProductTypes";
import { useCategories } from "@/admin/hooks/useCategories";
import userEvent from '@testing-library/user-event';

vi.mock('react-router', () => ({
  Link: vi.fn()
}));
vi.mock('@/admin/hooks/useProductTypes');
vi.mock('@/admin/hooks/useCategories');

const mockSchema = { fields: [{ name: 'color', type: 'text' }] };

const mockProductTypes = [
  { id: '1', name: 'Electronics', schema: mockSchema },
  { id: '2', name: 'Clothing',    schema: null },
];

const mockedProduct = {
  id: '1',
  title: 'Test Product',
  price: 10,
  stock: 10,
  description: 'Test Description',
  productType: mockProductTypes[0]
} as unknown as ProductUI;

const mockedProps = {
  title: 'Create Product',
  subtitle: '',
  isPending: false,
  onSubmit: vi.fn(),
  product: null as unknown as ProductUI
}

const createProps = {...mockedProps, mode: 'create' as const};

const editProps = {...mockedProps, mode: 'edit' as const, product: mockedProduct}

const renderForm = (props: React.ComponentProps<typeof ProductForm>) => {
  cleanup();
  render(<ProductForm {...props} />);
}

describe('ProductForm', () => {

  beforeEach(() => {
    vi.mocked(useProductTypes).mockReturnValue({
      data: mockProductTypes,
    } as unknown as ReturnType<typeof useProductTypes>);

    vi.mocked(useCategories).mockReturnValue({
      data: []
    } as unknown as ReturnType<typeof useCategories>)
  });

  it('should render the form', () => {
    renderForm(createProps);
    expect(screen.getByText('Product Information')).toBeTruthy();
  });

  it('should render product fields when in edit mode', () => {
    renderForm(editProps);
    
    expect(screen.getByText('Title')).toBeDefined();
    expect(screen.getByText('Price ($)')).toBeDefined();
    expect(screen.getByText('Stock')).toBeDefined();

    expect(screen.getByText('Categories')).toBeDefined();
    expect(screen.getByText('Tags')).toBeDefined();
    expect(screen.getByText('Images')).toBeDefined();
  });

  it('should not call onSubmit when a required field is empty', () => {
    renderForm(createProps);
    fireEvent.click(screen.getByRole('button', {name: 'Save'}));

    expect(createProps.onSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit when a validation is ok', async () => {
    renderForm(editProps);
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));

    await waitFor(() => {
      expect(editProps.onSubmit).toHaveBeenCalled();
    });
  });

  it('should disable button when isPending is true', () => {
    renderForm({...createProps, isPending: true});

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });
});