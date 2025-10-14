import { StepProps } from "../database-create.types";

export function StepSecond({ formData, setFormData }: StepProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Configuration
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Set the specific options for your chosen database system.
      </p>

      {formData.dbType === "mysql" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="mysqlCharset"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Character Set
            </label>
            <select
              id="mysqlCharset"
              value={formData.mysqlCharset}
              onChange={(e) =>
                setFormData((f) => ({ ...f, mysqlCharset: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="utf8mb4">utf8mb4 (Recommended)</option>
              <option value="latin1">latin1</option>
              <option value="binary">binary</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="mysqlCollation"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Collation
            </label>
            <select
              id="mysqlCollation"
              value={formData.mysqlCollation}
              onChange={(e) =>
                setFormData((f) => ({ ...f, mysqlCollation: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="utf8mb4_unicode_ci">utf8mb4_unicode_ci</option>
              <option value="utf8mb4_bin">utf8mb4_bin</option>
              <option value="latin1_swedish_ci">latin1_swedish_ci</option>
            </select>
          </div>
        </div>
      )}

      {formData.dbType === "postgres" && (
        <div className="space-y-4">
          <div>
            <label
              htmlFor="postgresOwner"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Owner
            </label>
            <input
              type="text"
              id="postgresOwner"
              value={formData.postgresOwner}
              onChange={(e) =>
                setFormData((f) => ({ ...f, postgresOwner: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              htmlFor="postgresEncoding"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Encoding
            </label>
            <select
              id="postgresEncoding"
              value={formData.postgresEncoding}
              onChange={(e) =>
                setFormData((f) => ({ ...f, postgresEncoding: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="UTF8">UTF8 (Recommended)</option>
              <option value="SQL_ASCII">SQL_ASCII</option>
              <option value="LATIN1">LATIN1</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
