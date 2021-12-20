import type {
  Dimension,
  JAQLElement,
  JAQL,
  DateLevel,
  SimpleAggregation,
  JAQLFilter,
} from "./JAQLSpecification";

class DimensionBuilder {
  _dim: string;
  _level?: DateLevel;
  _agg?: SimpleAggregation;
  _filter?: JAQLFilter;
  _panel?: "scope";
  _title?: string;

  constructor(dim: string) {
    this._dim = `[${dim}]`;
  }

  filter(filter: JAQLFilter) {
    this._filter = {
      ...this._filter,
      ...filter,
    };
    return this;
  }

  agg(method: SimpleAggregation) {
    this._agg = method;
    return this;
  }

  hide() {
    this._panel = "scope";
    return this;
  }

  level(level: DateLevel) {
    this._level = level;
    return this;
  }

  title(title: string) {
    this._title = title;
    return this;
  }

  build(): Dimension {
    const obj = {
      dim: this._dim,
      level: this._level,
      agg: this._agg,
      filter: this._filter,
      panel: this._panel,
      title: this._title,
    };

    return JSON.parse(JSON.stringify(obj)); //TODO: Find a better way to do this
  }
}
function dimension(dim: string) {
  return new DimensionBuilder(dim);
}

type JAQLMetadataCB = (
  dimension: (dim: string) => DimensionBuilder,
  formula: (
    template: TemplateStringsArray,
    ...substitutions: (DimensionBuilder | Dimension)[]
  ) => any
) => (JAQLElement | DimensionBuilder)[];

function formula(
  template: TemplateStringsArray,
  ...substitutions: (DimensionBuilder | Dimension)[]
) {
  return substitutions.reduce(
    ({ formula, context }, substitution, i) => {
      const name = `[ctx_${i}]`;
      const next = template[i + 1];

      return {
        formula: `${formula}${name}${next}`,
        context: {
          ...context,
          [name]:
            substitution instanceof DimensionBuilder
              ? substitution.build()
              : substitution,
        },
      };
    },
    {
      formula: template[0],
      context: {},
    }
  );
}

export function jaql(
  datasource: string,
  metadataCallback: JAQLMetadataCB
): JAQL {
  const metadata = metadataCallback(dimension, formula).map((element) => {
    if (element instanceof DimensionBuilder) {
      return element.build();
    } else {
      return element;
    }
  });

  return {
    datasource,
    metadata,
  };
}

export function printResult(result: { [key: string]: any }) {
  const data = result.values.map((row: string[]) => {
    return row
      .map((cell, colIndex) => {
        return {
          [result.headers[colIndex]]: cell,
        };
      })
      .reduce((a, b) => ({ ...a, ...b }), {});
  });
  console.table(data);
}
