import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { DynamicInput } from "./DynamicInput";

vi.mock('react-hook-form', () => ({
  register: vi.fn()
}))

const mockedField = {
  fieldKey: 1,
  field: {
    type: 'text',
    required: true,
    label: 'Mocked Field'
  },
  register: () => {},
  errors: { attributes: null}
} as unknown as React.ComponentProps<typeof DynamicInput>;

describe('DynamicInput', () => {
  test('should render correctly', ()=> {
    render(
      <DynamicInput
        fieldKey={mockedField.fieldKey}
        field={mockedField.field}
        register={mockedField.register}
        errors={mockedField.errors}
      />
    );

    expect(screen.getByText('Mocked Field')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
})