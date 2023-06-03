import { z } from "zod";

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
export const ValidateERD = (value: string): T_ERD => {
  return ERD.parse(JSON.parse(value));
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
            ]
        }
    ]
}`;
