import React, { Component, ChangeEvent } from "react";

type ParamType = "string";

interface Param {
  id: number;
  name: string;
  type: ParamType;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

interface State {
  paramValues: ParamValue[];
}

interface ParamInputProps {
  param: Param;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const ParamInput: React.FC<ParamInputProps> = ({ param, value, onChange }) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="w-full sm:flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
};

class ParamEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      paramValues: [...props.model.paramValues],
    };
  }

  getModel(): Model {
    return {
      paramValues: [...this.state.paramValues],
      colors: [...this.props.model.colors],
    };
  }

  handleParamChange = (
    paramId: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = event.target.value;
    this.setState((prevState) => ({
      paramValues: prevState.paramValues.map((paramValue) =>
        paramValue.paramId === paramId
          ? { ...paramValue, value: newValue }
          : paramValue
      ),
    }));
  };

  renderParamField(param: Param) {
    const paramValue = this.state.paramValues.find(
      (pv) => pv.paramId === param.id
    );
    return (
      <ParamInput
        param={param}
        value={paramValue ? paramValue.value : ""}
        onChange={(event) => this.handleParamChange(param.id, event)}
      />
    );
  }

  render() {
    const { params } = this.props;
    return (
      <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Редактор параметров
        </h2>
        {params.map((param) => (
          <div
            key={param.id}
            className="flex flex-col sm:flex-row sm:items-center mb-4 gap-2 sm:gap-0"
          >
            <label className="text-gray-600 font-medium w-full sm:w-40">
              {param.name}:
            </label>
            {this.renderParamField(param)}
          </div>
        ))}
      </div>
    );
  }
}

const App: React.FC = () => {
  const params: Param[] = [
    { id: 1, name: "Назначение", type: "string" },
    { id: 2, name: "Длина", type: "string" },
  ];

  const initialModel: Model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
    colors: [],
  };

  const editorRef = React.createRef<ParamEditor>();
  const [displayedValues, setDisplayedValues] = React.useState<string[]>([]);

  const handleGetModel = () => {
    if (editorRef.current) {
      const currentModel = editorRef.current.getModel();
      const values = currentModel.paramValues.map((paramValue) => {
        const param = params.find((p) => p.id === paramValue.paramId);
        return `${param?.name}: ${paramValue.value}`;
      });
      setDisplayedValues(values);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
          Пример редактора параметров
        </h1>
        <ParamEditor ref={editorRef} params={params} model={initialModel} />
        <button
          onClick={handleGetModel}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Получить модель
        </button>
        {displayedValues.length > 0 && (
          <div className="mt-6 bg-white shadow-lg rounded-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
              Значения параметров
            </h2>
            <ul className="text-sm sm:text-base text-gray-600">
              {displayedValues.map((value, index) => (
                <li key={index} className="mb-2">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
