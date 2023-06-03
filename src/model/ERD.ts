import { ZodError, z } from "zod";

const position_schema = z
  .object({
    x: z.number({
      errorMap: (_) => ({
        message: "Provide valid x coordinate",
      }),
    }),
    y: z.number({
      errorMap: (_) => ({
        message: "Provide valid y coordinate",
      }),
    }),
  })
  .default({ x: 0, y: 0 });

const attribute_schema = z
  .object({
    name: z.string({
      errorMap: (_) => ({
        message: "Provide valid attribute name",
      }),
    }),
    type: z
      .enum(["simple", "composite", "multivalued", "derived", "compound"], {
        errorMap: (_) => ({
          message:
            "Attribute Type can only be one of simple, composite, multivalued, derived, compound",
        }),
      })
      .default("simple"),
    derived_from: z
      .string({
        errorMap: (_) => ({
          message: "Provide a valid and existing attribute name",
        }),
      })
      .optional(),
    compound_attributes: z
      .array(
        z.string({
          errorMap: (_) => ({
            message: "Compound Attributes can only be string",
          }),
        })
      )
      .optional(),
    is_key: z
      .boolean({
        errorMap: (_) => ({
          message: "key can only be true or false as boolean value",
        }),
      })
      .default(false),
    position: position_schema,
  })
  .strict({
    message: "Key Not Recognized",
  });

const entity_schema = z
  .object({
    name: z.string({
      errorMap: (_) => ({
        message: "Provide valid entity name",
      }),
    }),
    type: z
      .enum(["weak", "strong"], {
        errorMap: (_) => ({
          message: "Entity Type can only be one of weak, strong",
        }),
      })
      .default("strong"),
    attributes: z.array(attribute_schema).optional(),
    position: position_schema,
  })
  .strict({
    message: "Key Not Recognized",
  });

const relationship_schema = z
  .object({
    name: z.string({
      errorMap: (_) => ({
        message: "Provide valid relationship name",
      }),
    }),
    attributes: z.array(attribute_schema).optional(),
    participating_entities: z.array(
      z.object({
        entity: z.string({
          errorMap: (_) => ({
            message: "Provide valid existing name",
          }),
        }),
        participation: z
          .enum(["total", "partial"], {
            errorMap: (_) => ({
              message: "Participation can only be one of total, partial",
            }),
          })
          .default("partial"),
        cardinality: z.enum(["1", "M"], {
          errorMap: (_) => ({
            message: "Cardinality can only be 1 of one, M",
          }),
        }),
      })
    ),
    position: position_schema,
  })
  .strict({
    message: "Key Not Recognized",
  });

export const ERD = z
  .object({
    entities: z
      .array(entity_schema, {
        errorMap: (_) => ({
          message: "Provide atleast one Entity",
        }),
      })
      .min(1, {
        message: "Provide atleast one Entity",
      }),
    relationships: z.array(relationship_schema).optional(),
  })
  .strict({
    message: "Key Not Recognized",
  });

export type T_ERD = z.infer<typeof ERD>;
export const ParseInput = (value: string): T_ERD => {
  return ERD.parse(JSON.parse(value));
};
export const ValidateERD = (erd: T_ERD) => {
  // check if any entity name is repeated
  const entity_names = erd.entities.map((entity) => entity.name);
  const unique_entity_names = new Set(entity_names);
  if (entity_names.length !== unique_entity_names.size) {
    throw new ZodError([
      {
        code: "custom",
        message: "Entity names should be unique",
        path: ["entities"],
      },
    ]);
  }
  // for each entity's  attributes, check if that entity's attribute name is repeated
  // also check if attribute is compound, then compound_attributes should be unique
  // also check if attribute is derived, then derived_from should be an existing attribute name
  erd.entities.forEach((entity, idx) => {
    const attribute_names = entity.attributes?.map((attr) => attr.name);
    if (attribute_names) {
      const unique_attribute_names = new Set(attribute_names);
      if (attribute_names.length !== unique_attribute_names.size) {
        throw new ZodError([
          {
            code: "custom",
            message: `Attribute names for entity ${entity.name} should be unique`,
            path: ["entities", idx, "attributes"],
          },
        ]);
      }
      entity.attributes?.forEach((attr, attr_idx) => {
        // if attribute is compound,
        // it must have compound_attributes
        // compound_attributes should be unique
        if (attr.type === "compound") {
          if (!attr.compound_attributes)
            throw new ZodError([
              {
                code: "custom",
                message: "Compound Attributes should be provided",
                path: ["entities", idx, "attributes", attr_idx],
              },
            ]);
          const unique_compound_attributes = new Set(attr.compound_attributes);
          if (
            attr.compound_attributes.length !== unique_compound_attributes.size
          )
            throw new ZodError([
              {
                code: "custom",
                message: `Compound Attributes name should be unique`,
                path: ["entities", idx, "attributes", attr_idx],
              },
            ]);
        }
        // if attribute is derived
        // it must have derived_from
        // derived_from should be an existing attribute name
        else if (attr.type === "derived") {
          if (!attr.derived_from)
            throw new ZodError([
              {
                code: "custom",
                message: `Derived Attributes should have derived_from`,
                path: ["entities", idx, "attributes", attr_idx],
              },
            ]);
          const derived_from_is_attribute = entity.attributes?.some(
            (attribute) => attribute.name === attr.derived_from
          );
          if (!derived_from_is_attribute)
            throw new ZodError([
              {
                code: "custom",
                message: `Derived From Attribute should be an existing attribute name`,
                path: ["entities", idx, "attributes", attr_idx],
              },
            ]);
        }
      });
    }
  });
};
export const DUMMY_JSON = `{
  "entities": [
      {
          "name": "User",
          "type": "strong",
          "attributes": [
              {
                  "name": "id",
                  "type": "simple",
                  "is_key": true
              },
              {
                  "name":"name",
                  "type": "compound",
                  "compound_attributes":["fname", "lname"]
              },
              {
                  "name":"dob",
                  "type":"simple"
              },
              {
                  "name":"age",
                  "type":"derived",
                  "derived_from":"dob"
              },
              {              
                  "name":"phone",
                  "type":"multivalued"
              }
          ]
      },
      {
          "name": "Post",
          "type": "strong",
          "attributes": [
              {
                  "name": "id",
                  "type": "simple",
                  "is_key": true
              },
              {
                  "name":"title",
                  "type": "simple"
              },
              {
                  "name":"body",
                  "type":"simple"
              }
          ]
      }
  ],
  "relationships": [
      {
          "name": "belongs to",
          "participating_entities": [
              {
                  "entity": "Post",
                  "cardinality": "M",
                  "participation":"total"
              },
              {
                  "entity": "User",
                  "cardinality": "1",
                  "participation":"partial"

              }
          ],
          "attributes":[
              {
                  "name":"created_at",
                  "type":"simple"
              }
          ]
      }
  ]
}`;
