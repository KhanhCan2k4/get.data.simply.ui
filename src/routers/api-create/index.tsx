import React, { useState, useMemo, useEffect } from "react";

// --- TYPE DEFINITIONS ---
type ColumnDef = {
  name: string;
  type: string;
  isDefault?: boolean; // e.g., id, created_at, updated_at
};

type EndpointMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface EndpointPreset {
  key: string;
  method: EndpointMethod;
  label: string;
  pathTemplate: (table: string, version: string) => string;
  hasOutputFields: boolean;
  hasInputFields: boolean;
  outputType?: "boolean" | "data" | "array";
  inputType?: "object" | "array" | "partial";
}

interface ResponseWrapperConfig {
  message: boolean;
  data: boolean;
  statusCode: boolean;
  status: boolean;
  path: boolean;
}

// --- MOCK DATA (In a real app, this comes from your API) ---
const MOCK_SCHEMA: Record<string, ColumnDef[]> = {
  users: [
    { name: "id", type: "INT", isDefault: true },
    { name: "name", type: "VARCHAR" },
    { name: "email", type: "VARCHAR" },
    { name: "password", type: "VARCHAR" },
    { name: "role", type: "VARCHAR" },
    { name: "created_at", type: "TIMESTAMP", isDefault: true },
    { name: "updated_at", type: "TIMESTAMP", isDefault: true },
  ],
  posts: [
    { name: "id", type: "INT", isDefault: true },
    { name: "user_id", type: "INT" },
    { name: "title", type: "VARCHAR" },
    { name: "body", type: "TEXT" },
    { name: "is_published", type: "BOOLEAN" },
    { name: "created_at", type: "TIMESTAMP", isDefault: true },
    { name: "updated_at", type: "TIMESTAMP", isDefault: true },
  ],
  comments: [
    { name: "id", type: "INT", isDefault: true },
    { name: "post_id", type: "INT" },
    { name: "user_id", type: "INT" },
    { name: "comment", type: "TEXT" },
    { name: "created_at", type: "TIMESTAMP", isDefault: true },
  ],
};

const MOCK_TABLE_NAMES = Object.keys(MOCK_SCHEMA);

// --- ENDPOINT PRESETS (Based on your requirements) ---
const ENDPOINT_PRESETS: EndpointPreset[] = [
  {
    key: "GET_ALL",
    method: "GET",
    label: "[GET] Get All Records",
    pathTemplate: (t, v) => `/api/${v}/${t}`,
    hasOutputFields: true,
    hasInputFields: false,
    outputType: "array",
  },
  {
    key: "GET_PAGINATED",
    method: "GET",
    label: "[GET] Get Paginated List",
    pathTemplate: (t, v) => `/api/${v}/${t}/paginated`,
    hasOutputFields: true,
    hasInputFields: false,
    outputType: "data",
  },
  {
    key: "GET_ONE",
    method: "GET",
    label: "[GET] Get One Record (by ID)",
    pathTemplate: (t, v) => `/api/${v}/${t}/:id`,
    hasOutputFields: true,
    hasInputFields: false,
    outputType: "data",
  },
  {
    key: "POST_STORE",
    method: "POST",
    label: "[POST] Store One or Many",
    pathTemplate: (t, v) => `/api/${v}/${t}`,
    hasOutputFields: true,
    hasInputFields: true,
    outputType: "array",
    inputType: "array",
  },
  {
    key: "PATCH_UPDATE",
    method: "PATCH",
    label: "[PATCH] Update One (Partial)",
    pathTemplate: (t, v) => `/api/${v}/${t}/:id`,
    hasOutputFields: true,
    hasInputFields: true,
    outputType: "data",
    inputType: "partial",
  },
  {
    key: "PUT_REPLACE",
    method: "PUT",
    label: "[PUT] Replace One (Full)",
    pathTemplate: (t, v) => `/api/${v}/${t}/:id`,
    hasOutputFields: false,
    hasInputFields: true,
    outputType: "boolean",
    inputType: "object",
  },
  {
    key: "DELETE_ONE",
    method: "DELETE",
    label: "[DELETE] Delete One",
    pathTemplate: (t, v) => `/api/${v}/${t}/:id`,
    hasOutputFields: false,
    hasInputFields: false,
    outputType: "boolean",
  },
];

// --- HELPER COMPONENTS ---
const SectionHeader: React.FC<{ number: number; title: string }> = ({
  number,
  title,
}) => (
  <div className="flex items-center gap-3">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-400 text-white font-bold">
      {number}
    </span>
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
  </div>
);

const ToggleSwitch: React.FC<{
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}> = ({ label, enabled, onChange }) => (
  <label className="flex items-center justify-between p-3 bg-white rounded-lg cursor-pointer shadow-sm">
    <span className="font-medium text-gray-700">{label}</span>
    <div
      className={`relative w-11 h-6 rounded-full transition-colors ${
        enabled ? "bg-blue-400" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        } absolute top-1`}
      />
    </div>
    <input
      type="checkbox"
      checked={enabled}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only"
    />
  </label>
);

const ColumnSelector: React.FC<{
  title: string;
  columns: ColumnDef[];
  selected: Set<string>;
  onChange: (newSet: Set<string>) => void;
}> = ({ title, columns, selected, onChange }) => {
  const handleToggle = (colName: string) => {
    const newSet = new Set(selected);
    if (newSet.has(colName)) {
      newSet.delete(colName);
    } else {
      newSet.add(colName);
    }
    onChange(newSet);
  };

  const toggleAll = () => {
    if (selected.size === columns.length) {
      onChange(new Set()); // Deselect all
    } else {
      onChange(new Set(columns.map((c) => c.name))); // Select all
    }
  };

  return (
    <div className="p-4 rounded-lg bg-gray-50">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-semibold text-gray-700">{title}</h4>
        <button
          onClick={toggleAll}
          className="text-xs font-medium text-blue-400 hover:text-blue-500 cursor-pointer"
        >
          {selected.size === columns.length ? "Deselect All" : "Select All"}
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {columns.map((col) => (
          <label
            key={col.name}
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            <input
              type="checkbox"
              className="form-checkbox h-4 w-4 text-blue-600 rounded"
              checked={selected.has(col.name)}
              onChange={() => handleToggle(col.name)}
            />
            <span className="text-sm text-gray-800 font-mono">{col.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function ApiCreatePage() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [tableColumns, setTableColumns] = useState<ColumnDef[]>([]);
  const [selectedPresetKey, setSelectedPresetKey] = useState<string>("");
  const [apiVersion, setApiVersion] = useState<number>(1);
  const [returnedFields, setReturnedFields] = useState<Set<string>>(new Set());
  const [responseWrapper, setResponseWrapper] = useState<ResponseWrapperConfig>(
    {
      message: true,
      data: true,
      statusCode: true,
      status: true,
      path: true,
    }
  );

  // --- Memos for derived state ---
  const selectedPreset = useMemo(() => {
    return ENDPOINT_PRESETS.find((p) => p.key === selectedPresetKey) || null;
  }, [selectedPresetKey]);

  const endpointPath = useMemo(() => {
    if (!selectedPreset || !selectedTable) return "";
    return selectedPreset.pathTemplate(selectedTable, `v${apiVersion}`);
  }, [selectedPreset, selectedTable, apiVersion]);

  const inputColumns = useMemo(() => {
    return tableColumns.filter((c) => !c.isDefault);
  }, [tableColumns]);

  // --- Event Handlers ---
  const handleTableChange = (tableName: string) => {
    setSelectedTable(tableName);
    const columns = MOCK_SCHEMA[tableName] || [];
    setTableColumns(columns);

    // Reset selections
    setSelectedPresetKey("");
    setReturnedFields(new Set(columns.map((c) => c.name))); // Select all fields by default
  };

  const handlePresetChange = (presetKey: string) => {
    setSelectedPresetKey(presetKey);
    // --- Auto-version check logic ---
    // In a real app, you would make an API call here
    // const path = ENDPOINT_PRESETS.find(p => p.key === presetKey)?.pathTemplate(selectedTable, '');
    // fetch(`/api/check-version?path=${path}`).then(res => res.json()).then(data => setApiVersion(data.nextVersion));
    // For this demo, we'll just simulate it.
    if (selectedTable === "users" && presetKey === "GET_ALL") {
      setApiVersion(2); // Mock: pretend v1 of this endpoint already exists
    } else {
      setApiVersion(1); // Default to v1
    }
  };

  // --- Final Configuration Object for Preview ---
  const finalConfig = useMemo(() => {
    if (!selectedPreset || !selectedTable) return null;

    let outputConfig: any = { type: selectedPreset.outputType };
    if (selectedPreset.hasOutputFields) {
      outputConfig.fields = Array.from(returnedFields);
    }

    let inputConfig: any = { type: selectedPreset.inputType };
    if (selectedPreset.hasInputFields) {
      inputConfig.fields = inputColumns.map((c) => c.name);
    }

    return {
      endpoint: {
        table: selectedTable,
        method: selectedPreset.method,
        path: endpointPath,
        version: apiVersion,
      },
      config: {
        input: selectedPreset.hasInputFields ? inputConfig : "N/A",
        output: outputConfig,
      },
      responseWrapper: Object.keys(responseWrapper).filter(
        (k) => responseWrapper[k as keyof ResponseWrapperConfig]
      ),
    };
  }, [
    selectedTable,
    selectedPreset,
    apiVersion,
    endpointPath,
    returnedFields,
    inputColumns,
    responseWrapper,
  ]);

  const handleGenerate = () => {
    console.log("SENDING TO BACKEND:", JSON.stringify(finalConfig, null, 2));
    alert(
      "Configuration logged to console. In a real app, this would be sent to the backend."
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-4 divide-y divide-gray-200">
        <section className="py-6 space-y-6">
          <SectionHeader number={1} title="Define Endpoint" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="table" className="block text-sm font-medium mb-1">
                Select Table
              </label>
              <select
                id="table"
                value={selectedTable}
                onChange={(e) => handleTableChange(e.target.value)}
                className="w-full form-select rounded-2xl outline-0 p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500 "
              >
                <option value="" disabled>
                  -- Choose a table --
                </option>
                {MOCK_TABLE_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="preset"
                className="block text-sm font-medium mb-1"
              >
                Select Endpoint Preset
              </label>
              <select
                id="preset"
                value={selectedPresetKey}
                onChange={(e) => handlePresetChange(e.target.value)}
                className="w-full form-select rounded-2xl outline-0 p-4 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={!selectedTable}
              >
                <option value="" disabled>
                  -- Choose a preset --
                </option>
                {ENDPOINT_PRESETS.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {selectedPreset && (
          <section className="py-6 space-y-6">
            <SectionHeader number={2} title="Configure Endpoint" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Generated Endpoint Path
              </label>
              <div className="flex shadow-sm rounded-xl">
                <span
                  className={`px-4 py-2 rounded-l-lg border border-r-0 font-mono text-sm ${
                    {
                      GET: "bg-green-100 text-green-800 border-green-300",
                      POST: "bg-blue-100 text-blue-800 border-blue-300",
                      PATCH: "bg-yellow-100 text-yellow-800 border-yellow-300",
                      PUT: "bg-orange-100 text-orange-800 border-orange-300",
                      DELETE: "bg-red-100 text-red-800 border-red-300",
                    }[selectedPreset.method]
                  }`}
                >
                  {selectedPreset.method}
                </span>

                <span className="px-4 py-2 bg-gray-100">
                  {endpointPath}/
                </span>
                <input
                  type="text"
                  value={endpointPath}
                  className="flex-1 form-input rounded-r-lg outline-0 px-2"
                />
              </div>
            </div>

            {selectedPreset.hasInputFields ? (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Input Configuration
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  The request body should be a{" "}
                  {selectedPreset.inputType === "array"
                    ? "single object or an array of objects"
                    : "single object"}{" "}
                  with the following fields:
                </p>
                <div className="p-4 rounded-lg bg-gray-50 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {inputColumns.length > 0 ? (
                    inputColumns.map((col) => (
                      <div
                        key={col.name}
                        className="bg-white p-2 rounded"
                      >
                        <span className="font-mono text-sm text-gray-900">
                          {col.name}
                        </span>
                        <span className="font-mono text-xs text-gray-500 block">
                          {col.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No input fields required.
                    </p>
                  )}
                </div>
              </div>
            ) : selectedPreset.key === "GET_PAGINATED" ? (
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  Query Parameters
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  This endpoint accepts the following query parameters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "page",
                    "per-page",
                    "keyword",
                    "search-type",
                    "search-on-columns",
                    "order-by-columns",
                    "order-direction",
                  ].map((param) => (
                    <span
                      key={param}
                      className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-full"
                    >
                      {param}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Output Configuration
              </h3>
              {selectedPreset.hasOutputFields ? (
                <ColumnSelector
                  title="Returned Fields"
                  columns={tableColumns}
                  selected={returnedFields}
                  onChange={setReturnedFields}
                />
              ) : (
                <p className="text-sm text-gray-600">
                  This endpoint will return a{" "}
                  <strong>{selectedPreset.outputType}</strong> value.
                </p>
              )}
            </div>
          </section>
        )}

        <section className="py-6 space-y-6">
          <SectionHeader number={3} title="Response Structure" />
          <p className="text-sm text-gray-600">
            Toggle which fields to include in the standard JSON response
            wrapper.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(responseWrapper).map((key) => (
              <ToggleSwitch
                key={key}
                label={key}
                enabled={responseWrapper[key as keyof ResponseWrapperConfig]}
                onChange={(enabled) =>
                  setResponseWrapper((prev) => ({ ...prev, [key]: enabled }))
                }
              />
            ))}
          </div>
        </section>

        <section className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Generate Endpoint
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                When you are ready, save this configuration. A backend process
                will then generate and deploy this API endpoint.
              </p>
              <button
                onClick={handleGenerate}
                disabled={!finalConfig}
                className="w-full px-6 py-3 bg-blue-400 text-white font-bold rounded-lg text-lg hover:bg-blue-500 transition-colors shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Generate API Endpoint
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Live Configuration Preview
              </h3>
              <pre className="bg-gray-900 text-white p-4 rounded-lg text-xs whitespace-pre-wrap h-64 overflow-auto">
                {finalConfig ? (
                  JSON.stringify(finalConfig, null, 2)
                ) : (
                  <span className="text-gray-400">
                    Please select a table and preset...
                  </span>
                )}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
