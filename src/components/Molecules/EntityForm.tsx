import { UseFormReturnType } from "@mantine/form";
import React from "react";
import { ATTRIBUTE_TYPES } from "../../model/Attribute";
import { Button } from "../Atoms/Button/Button";
import { T_EntityForm } from "../../App";

type Props = {
  form: UseFormReturnType<T_EntityForm>;
};

const EntityForm: React.FC<Props> = (props) => {
  const { form } = props;
  return (
    <div className="grid gap-3 grid-rows-[max-content_minmax(400px_1fr)_max-content]">
      <div className="grid gap-2 overflow-auto">
        <label htmlFor="name">Entity Name</label>
        <input
          type="text"
          className="bg-neutral-700 p-2 rounded focus:outline-none"
          placeholder="Enter Entity Name"
          {...form.getInputProps("name")}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex gap-4 items-center">
          <p className="text-lg">Add Attributes</p>
          <Button
            className="w-[25px] rounded text-sm h-[25px]  grid place-items-center bg-white"
            onClick={() =>
              form.insertListItem("attributes", {
                name: "",
                type: ATTRIBUTE_TYPES.SIMPLE,
              })
            }
          >
            ➕
          </Button>
        </div>
        <div className="grid items-start gap-3 max-h-[400px] overflow-x-hidden overflow-y-auto px-3 py-2 bg-neutral-900 rounded">
          {form.values.attributes.map((_, index) => (
            <>
              <div
                key={`attribute-no-${index}`}
                className="flex gap-3 w-fit items-end h-fit "
              >
                <div className="grid gap-2">
                  <label htmlFor={`attributes.${index}.name`}>
                    Attribute Name
                  </label>
                  <input
                    type="text"
                    className="bg-neutral-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
                    placeholder="Enter Attribute Name"
                    id={`attributes.${index}.name`}
                    {...form.getInputProps(`attributes.${index}.name`)}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor={`attributes.${index}.type`}>
                    Attribute Type
                  </label>
                  <select
                    id={`attributes.${index}.type`}
                    className="bg-neutral-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-300"
                    {...form.getInputProps(`attributes.${index}.type`)}
                  >
                    {Object.values(ATTRIBUTE_TYPES).map((type) => (
                      <option
                        key={`Attribute-${index}-${type}`}
                        value={type}
                        className="capitalize"
                      >
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid items-center">
                  <input
                    id={`attributes.${index}.is_unique`}
                    type="checkbox"
                    {...form.getInputProps(`attributes.${index}.is_unique`)}
                  />
                  <label htmlFor={`attributes.${index}.is_unique`}>
                    Is Unique
                  </label>
                </div>
                <Button
                  className={`p-2 rounded  ${
                    form.values.attributes.length <= 1
                      ? "bg-neutral-500 cursor-not-allowed"
                      : "bg-red-500"
                  }`}
                  onClick={() => {
                    if (form.values.attributes.length > 1) {
                      form.removeListItem("attributes", index);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="w-full grid items-end">
        <Button type="submit" className="p-2 bg-blue-500 rounded w-full">
          Add Entity
        </Button>
      </div>
    </div>
  );
};

export default EntityForm;
