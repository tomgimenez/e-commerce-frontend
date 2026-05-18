import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ProductForm } from "./ProductForm";
import userEvent from '@testing-library/user-event';

vi.mock('react-router', () => ({
  Link: vi.fn()
}));

vi.mock('./BasicInformationSection', () => ({
  BasicInformationSection: () => <div />
}));

vi.mock('./CategoriesSection', () => ({
  CategoriesSection: () => <div>Categories Section</div>
}));

vi.mock('./TagsSection', () => ({
  TagsSection: () => <div>Tags Section</div>
}));

vi.mock('./ImagesSection', () => ({
  ImagesSection: () => <div>Images Section</div>
}));

const mockedProduct = {
  id: '1',
  title: 'Test Product',
  price: 10,
  stock: 10,
  description: 'Test Description',
  productType: {schema: true}
};

const mockedCreateProps = {
  mode: 'create',
  title: 'Create Product',
  subtitle: '',
  isPending: false,
  onSubmit: vi.fn(),
  product: null
} as unknown as React.ComponentProps<typeof ProductForm>

const mockedEditProps = {
  ...mockedCreateProps,
  mode: 'edit',
  title: 'Edit Product',
  product: mockedProduct
} as unknown as React.ComponentProps<typeof ProductForm>;

const renderForm = (props: React.ComponentProps<typeof ProductForm>) => {
  cleanup();
  render(<ProductForm {...props} />);
}

describe('ProductForm', () => {

  it('should render the form and not show sections in create mode', () => {
    renderForm(mockedCreateProps);

    expect(screen.getByText("Create Product")).toBeInTheDocument();
    expect(screen.queryByText('Categories Section')).not.toBeInTheDocument();
    expect(screen.queryByText('Tags Section')).not.toBeInTheDocument();
    expect(screen.queryByText('Images Section')).not.toBeInTheDocument();
  });

  it('should render correct title and sections when in edit mode', () => {
    renderForm(mockedEditProps);

    expect(screen.getByText("Edit Product")).toBeInTheDocument();
    expect(screen.getByText('Categories Section')).toBeInTheDocument();
    expect(screen.getByText('Tags Section')).toBeInTheDocument();
    expect(screen.getByText('Images Section')).toBeInTheDocument();
  });

  it('should call onSubmit when a validation is ok', async () => {
    renderForm(mockedEditProps);

    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    await waitFor(() => {
      expect(mockedEditProps.onSubmit).toHaveBeenCalled();
    });
  });

  it('should disable button when isPending is true', () => {
    renderForm({...mockedCreateProps, isPending: true});

    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });
});