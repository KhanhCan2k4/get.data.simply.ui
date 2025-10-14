import { MySQLIcon, PostgresIcon } from "@/components/icon";
import { StepProps } from "@/routers/database-create/database-create.types";

export function StepFirst({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Basic Information
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Select the database system and give your new database a name.
      </p>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Database System
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div
            onClick={() => setFormData((f) => ({ ...f, dbType: "mysql" }))}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.dbType === "mysql"
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <MySQLIcon />
            <p className="text-center font-semibold mt-2">MySQL</p>
          </div>
          <div
            onClick={() => setFormData((f) => ({ ...f, dbType: "postgres" }))}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.dbType === "postgres"
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <PostgresIcon />
            <p className="text-center font-semibold mt-2">PostgreSQL</p>
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="dbName"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Database Name
        </label>
        <input
          type="text"
          id="dbName"
          value={formData.dbName}
          onChange={(e) =>
            setFormData((f) => ({ ...f, dbName: e.target.value }))
          }
          placeholder="e.g., my_application_db"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
}
