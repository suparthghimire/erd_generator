import React from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import { T_ERD, T_Attribute, T_Entity, T_Relationship } from "../../model/ERD";
import Button from "../Atoms/Button/Button";

const windowYOffset = 120;
const BLACK = 0;
const WHITE = 255;

let drag_node: T_Entity | T_Attribute | T_Relationship | null = null;
let pan_offset: p5Types.Vector | null = null;

const Canvas: React.FC<{ erd: T_ERD }> = (props) => {
  const [primaryColor, setPrimaryColor] = React.useState(BLACK);
  const [secondaryColor, setSecondaryColor] = React.useState(WHITE);

  const switchTheme = () => {
    if (primaryColor === BLACK) {
      setPrimaryColor(WHITE);
      setSecondaryColor(BLACK);
    } else {
      setPrimaryColor(BLACK);
      setSecondaryColor(WHITE);
    }
  };
  const setup = (p5: p5Types, canvasParentRef: Element) => {
    console.log(props.erd);
    p5.createCanvas(
      window.innerWidth,
      window.innerHeight - windowYOffset
    ).parent(canvasParentRef);
  };
  const setLinedDashed = (p5: p5Types, list: number[]) => {
    p5.strokeWeight(2);
    p5.stroke(secondaryColor);
    (p5.drawingContext as CanvasRenderingContext2D).setLineDash(list);
  };
  const draw = (p5: p5Types) => {
    p5.background(primaryColor);

    props.erd.relationships?.forEach((relationship, idx) =>
      drawRelationship(p5, relationship, idx)
    );
    props.erd.entities.forEach((entity, idx) => drawEntity(p5, entity, idx));
  };
  const drawEntity = (p5: p5Types, entity: T_Entity, idx: number) => {
    const x = entity.position.x;
    const y = entity.position.y;

    const name = entity.name;
    const entity_width = name.length;
    const entity_height = 20;

    const entity_padded_width = entity_width * 20;
    const entity_padded_height = entity_height + 20;

    // set x, y position of entity
    entity.position = { x, y };
    // set size position of entity
    entity.size = { width: entity_padded_width, height: entity_padded_height };

    // draw attributes and lines from attribute to entity
    entity.attributes?.forEach((attribute, idx) =>
      drawAttribute(
        p5,
        {
          name,
          x,
          y,
          len: entity_padded_width,
          ht: entity_padded_height,
        },
        attribute,
        idx
      )
    );

    // draw entity
    p5.fill(primaryColor);
    p5.strokeWeight(2);
    p5.stroke(secondaryColor);
    p5.rect(x, y, entity_padded_width, entity_padded_height);
    // write entity name
    p5.fill(secondaryColor);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(entity_height);
    p5.text(name, x + entity_padded_width / 2, y + entity_padded_height / 2);
  };
  const drawAttribute = (
    p5: p5Types,
    parentEntity: {
      name: string;
      x: number;
      y: number;
      len: number;
      ht: number;
    },
    attribute: T_Attribute,
    idx: number
  ) => {
    const x = attribute.position.x;
    const y = attribute.position.y;

    const name = attribute.name;
    const attr_width = name.length;
    const attr_height = 20;

    const attr_padded_width = attr_width * 20;
    const attr_padded_height = attr_height + 20;
    // set x, y position of attribute
    attribute.position = { x, y };

    if (attribute.type === "compound") {
      attribute.compound_attributes?.forEach((compound_attribute, cmp_idx) => {
        const name = compound_attribute;
        const cmp_attr_name_width = name.length;
        const cmp_attr_name_height = 20;

        const x =
          attribute.position.x -
          attr_padded_width -
          cmp_attr_name_height +
          cmp_idx;
        const OFFSET = 50;
        const y =
          attribute.position.y +
          attr_padded_height -
          OFFSET * cmp_idx -
          attr_padded_height / 2;

        const cmp_attr_padded_width = cmp_attr_name_width * 20;
        const cmp_attr_padded_height = cmp_attr_name_height + 20;

        // draw line from compound attribute to attribute
        p5.stroke(secondaryColor);
        p5.strokeWeight(2);
        p5.line(x, y, attribute.position.x, attribute.position.y);

        // compound attribute
        p5.fill(primaryColor);
        p5.stroke(secondaryColor);
        p5.strokeWeight(2);
        p5.arc(
          x,
          y,
          cmp_attr_padded_width,
          cmp_attr_padded_height,
          0,
          2 * p5.PI
        );

        // name
        p5.fill(secondaryColor);
        p5.noStroke();
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.textSize(cmp_attr_name_height);
        p5.text(name, x, y);
      });
    }
    // set size of attribute
    attribute.size = { width: attr_padded_width, height: attr_padded_height };

    // draw line from attribute to entity
    // if attribute is not derived, then draw line to entity
    // else draw line to derived from attribute
    if (attribute.type !== "derived") {
      p5.stroke(secondaryColor);
      p5.strokeWeight(2);
      p5.line(
        x,
        y,
        parentEntity.x + parentEntity.len / 2,
        parentEntity.y + parentEntity.ht / 2
      );
    } else {
      if (attribute.derived_from) {
        // find that attribute
        const my_parent = props.erd.entities.find(
          (entity) => entity.name === parentEntity.name
        );
        const my_derived_from = my_parent?.attributes?.find(
          (attr) => attr.name === attribute.derived_from
        );
        if (my_derived_from) {
          p5.stroke(secondaryColor);
          p5.strokeWeight(2);
          p5.line(x, y, my_derived_from.position.x, my_derived_from.position.y);
        }
      }
    }
    // draw arc with height and width
    // if attribute is derived, then draw a arc with dashed border
    // else draw normal arc
    p5.fill(primaryColor);
    p5.stroke(secondaryColor);
    p5.strokeWeight(2);
    if (attribute.type !== "derived")
      p5.arc(x, y, attr_padded_width, attr_padded_height, 0, 2 * p5.PI);
    else {
      setLinedDashed(p5, [5, 5]);
      p5.arc(x, y, attr_padded_width, attr_padded_height, 0, 2 * p5.PI);
      setLinedDashed(p5, []);
    }
    // write attribute name
    p5.fill(secondaryColor);
    p5.noStroke();
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(attr_height);
    p5.text(name, x, y);

    // if attribute is key, underline text
    if (attribute.is_key === true) {
      p5.stroke(secondaryColor);
      p5.strokeWeight(2);
      p5.line(
        x - attr_padded_width / 4,
        y + 10,
        x + attr_padded_height / 4,
        y + 10
      );
      p5.strokeWeight(1);
    }
    if (attribute.type === "multivalued") {
      p5.noFill();
      p5.stroke(secondaryColor);
      p5.arc(
        x,
        y,
        attr_padded_width - 10,
        attr_padded_height - 10,
        0,
        2 * p5.PI
      );
    }

    // if attribute is composite, for each composite attribute, draw a simple arc
  };
  const drawRelationship = (
    p5: p5Types,
    relationship: T_Relationship,
    idx: number
  ) => {
    // draw a diamond shape
    const x = relationship.position.x;
    const y = relationship.position.y;

    const name = relationship.name;

    const rel_width = name.length;
    const rel_height = 20;
    const rel_padded_width = rel_width * 20;
    const rel_padded_height = rel_height + 20;
    const rel_diag_len = Math.sqrt(
      Math.pow(rel_padded_width / 2, 2) + Math.pow(rel_padded_height / 2, 2)
    );
    // draw diamond
    p5.fill(primaryColor);
    p5.stroke(secondaryColor);
    p5.strokeWeight(2);

    // draw any attributes
    relationship.attributes?.forEach((attribute, idx) =>
      drawAttribute(
        p5,
        {
          name,
          len: rel_diag_len,
          x,
          y,
          ht: rel_diag_len,
        },
        attribute,
        idx
      )
    );

    // for each participating entity
    // draw line from entity to relationship
    const centerX = x + rel_diag_len / 2;
    const centerY = y;

    relationship.participating_entities.forEach((p_e) => {
      const entity = props.erd.entities.find(
        (entity) => entity.name === p_e.entity
      );
      if (entity) {
        p5.stroke(secondaryColor);
        p5.strokeWeight(2);
        p5.line(
          centerX,
          centerY,
          entity.position.x + entity.size.width / 2,
          entity.position.y + entity.size.height / 2
        );
        // if it is total participation, draw one more line with small offset
        if (p_e.participation === "total") {
          const offset = 10;
          p5.stroke(secondaryColor);
          p5.strokeWeight(2);
          p5.line(
            centerX + offset,
            centerY + offset,
            entity.position.x + entity.size.width / 2 + offset,
            entity.position.y + entity.size.height / 2 + offset
          );
        }
        // in middle of line, write cardinality
        const midX = (centerX + entity.position.x + entity.size.width / 2) / 2;
        const midY = (centerY + entity.position.y + entity.size.height / 2) / 2;

        // draw circle
        p5.noStroke();
        p5.fill(primaryColor);
        p5.circle(midX, midY, 20);

        p5.fill(secondaryColor);
        p5.noStroke();
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(p_e.cardinality, midX, midY);
      }
    });

    // set position of relationship
    relationship.position = { x, y };
    // set size of relationship
    relationship.size = {
      width: rel_diag_len,
      height: rel_diag_len,
    };

    // draw sqare and rotate it
    p5.fill(primaryColor);
    p5.stroke(secondaryColor);
    p5.push();
    p5.translate(x + rel_diag_len / 2, y - rel_diag_len / 2);
    p5.rotate(p5.PI / 4);
    p5.rect(0, 0, rel_diag_len, rel_diag_len);
    p5.pop();

    // write relationship name
    p5.fill(secondaryColor);
    p5.noStroke();
    p5.textSize(rel_height);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.push();
    p5.translate(x + rel_diag_len / 2, y + rel_diag_len / 4);
    p5.text(name, 0, 0);
    p5.pop();

    // draw attribute
  };
  const windowResized = (p5: p5Types) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight - windowYOffset);
  };
  const mousePressed = (p5: p5Types) => {
    // check for every entity

    console.log("MOUSE PRESSED");
    for (let i = props.erd.entities.length - 1; i >= 0; i--) {
      const entity = props.erd.entities[i];
      if (mouseInBox(p5, entity.position, entity.size)) {
        console.log("IN ENTITY", entity.name);
        drag_node = entity;
        break;
      }
    }
    // check for attribute
    if (props.erd.attributes) {
      for (let i = props.erd.attributes.length - 1; i >= 0; i--) {
        const attribute = props.erd.attributes[i];
        if (mouseInEllipse(p5, attribute.position, attribute.size)) {
          console.log("IN ATTRIBUTE", attribute);
          console.log("MOUSE", p5.mouseX, p5.mouseY);
          drag_node = attribute;
          break;
        }
      }
    }
    // check for every relationship
    if (props.erd.relationships) {
      for (let i = props.erd.relationships.length - 1; i >= 0; i--) {
        const relationship = props.erd.relationships[i];
        if (mouseInBox(p5, relationship.position, relationship.size)) {
          console.log("IN RELATIONSHIP", relationship.name);
          drag_node = relationship;
          break;
        }
      }
    }
    // if nothing is selected, then drag the whole canvas
    if (!drag_node) pan_offset = p5.createVector(p5.mouseX, p5.mouseY);
  };

  const mouseInEllipse = (
    p5: p5Types,
    pos: { x: number; y: number },
    size: { width: number; height: number }
  ) => {
    const dx = p5.mouseX - pos.x;
    const dy = p5.mouseY - pos.y;
    const rx = size.width / 2;
    const ry = size.height / 2;
    return (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
  };
  const mouseInBox = (
    p5: p5Types,
    pos: { x: number; y: number },
    size: { width: number; height: number }
  ) => {
    return (
      p5.mouseX > pos.x &&
      p5.mouseX < pos.x + size.width &&
      p5.mouseY > pos.y &&
      p5.mouseY < pos.y + size.height
    );
  };

  const mouseReleased = () => {
    drag_node = null;
    pan_offset = null;
  };
  const mouseDragged = (p5: p5Types) => {
    if (drag_node) {
      console.log("DRAGGING", drag_node);
      drag_node.position.x = p5.mouseX;
      drag_node.position.y = p5.mouseY;
    } else if (pan_offset) {
      const new_pan_offset = p5.createVector(p5.mouseX, p5.mouseY);
      const diff = p5.createVector(
        new_pan_offset.x - pan_offset.x,
        new_pan_offset.y - pan_offset.y
      );
      pan_offset = new_pan_offset;

      // for all entities, attributes, and relationships, move them by diff
      props.erd.entities.forEach((entity) => {
        entity.position.x += diff.x;
        entity.position.y += diff.y;
      });

      if (props.erd.attributes) {
        props.erd.attributes.forEach((attribute) => {
          attribute.position.x += diff.x;
          attribute.position.y += diff.y;
        });
      }

      if (props.erd.relationships) {
        props.erd.relationships.forEach((relationship) => {
          relationship.position.x += diff.x;
          relationship.position.y += diff.y;
        });
      }
    }
  };
  return (
    <div>
      <div className="absolute bottom-5 left-5 text-white">
        <Button className="p-2 rounded" onClick={() => switchTheme()}>
          Switch Theme to {primaryColor === BLACK ? "Light" : "Dark"}
        </Button>
      </div>
      <Sketch
        setup={setup}
        draw={draw}
        windowResized={windowResized}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        mouseDragged={mouseDragged}
      />
    </div>
  );
};

export default Canvas;
