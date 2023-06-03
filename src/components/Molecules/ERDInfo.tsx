import { T_ERD } from "../../model/ERD";

const ERDInfo: React.FC<{ erd: T_ERD }> = (props) => {
  return (
    <>
      <div>
        <h1 className="font-bold text-xl">Entities</h1>
        <ol type="1" className="list-decimal px-4">
          {props.erd.entities.map((entity) => (
            <li key={`entity-${entity.name}-${entity.type}`}>
              {entity.name} - {entity.type}
              {entity.attributes && (
                <ul className="ml-4 list-disc">
                  {entity.attributes.map((attr) => {
                    return (
                      <li
                        key={`entity-${entity.name}-${entity.type}-attr-${attr.name}`}
                      >
                        {attr.name} - {attr.type}
                        {attr.derived_from && (
                          <span className="ml-2 text-sm">
                            (derived from {attr.derived_from})
                          </span>
                        )}
                        {attr.compound_attributes && (
                          <ul className="ml-4 list-disc">
                            {attr.compound_attributes.map((compound_attr) => {
                              return (
                                <li
                                  key={`entity-${entity.name}-${entity.type}-attr-${attr.name}-compound-${compound_attr}`}
                                >
                                  {compound_attr}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
      {props.erd.relationships && (
        <div>
          <h1 className="font-bold text-xl">Relationships</h1>
          <ol type="1" className="ml-4 list-decimal">
            {props.erd.relationships.map((relationship) => {
              return (
                <li
                  key={`relationship-${
                    relationship.name
                  }-${relationship.participating_entities.map(
                    (e) => `${e.entity} - ${e.participation} - ${e.cardinality}`
                  )}`}
                >
                  <div>
                    <span>Name:</span>
                    <span>{relationship.name}</span>
                  </div>
                  <div>
                    <span>Participating Entities:</span>
                    <ul className="ml-4 list-disc">
                      {relationship.participating_entities.map((e) => {
                        return (
                          <li
                            key={`relationship-${relationship.name}-${e.entity}-${e.participation}-${e.cardinality}`}
                          >
                            <span>
                              {e.entity} with {e.cardinality} Cardinality in{" "}
                              {e.participation} participation
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {relationship.attributes && (
                    <div>
                      <span>Attributes</span>
                      <ul className="ml-4 list-disc">
                        {relationship.attributes.map((attr) => {
                          return (
                            <li
                              key={`relationship-${relationship.name}-${attr.name}-${attr.type}`}
                            >
                              <span>
                                {attr.name} - {attr.type}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </>
  );
};
export default ERDInfo;
