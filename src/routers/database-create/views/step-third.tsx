import { FormState } from "@/routers/database-create/database-create.types";

type StepThirdProps = {
  formData: FormState;
  generatedSql: string;
};

export function StepThird({ formData, generatedSql }: StepThirdProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Review and Create
      </h2>
      <p className="text-center text-gray-500 mb-8">
        Confirm the details below. If everything looks correct, create your
        database.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-gray-700">
        <p>
          <strong>Database Name:</strong>{" "}
          <span className="font-mono text-blue-700">{formData.dbName}</span>
        </p>
        <p>
          <strong>System:</strong>{" "}
          <span className="font-semibold capitalize">{formData.dbType}</span>
        </p>
        {formData.dbType === "mysql" && (
          <>
            <p>
              <strong>Character Set:</strong>{" "}
              <span className="font-mono">{formData.mysqlCharset}</span>
            </p>
            <p>
              <strong>Collation:</strong>{" "}
              <span className="font-mono">{formData.mysqlCollation}</span>
            </p>
          </>
        )}
        {formData.dbType === "postgres" && (
          <>
            <p>
              <strong>Owner:</strong>{" "}
              <span className="font-mono">{formData.postgresOwner}</span>
            </p>
            <p>
              <strong>Encoding:</strong>{" "}
              <span className="font-mono">{formData.postgresEncoding}</span>
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Generated SQL Command
        </label>
        <pre className="bg-gray-900 text-white p-4 rounded-lg text-sm whitespace-pre-wrap">
          <code>{generatedSql}</code>
        </pre>
      </div>
    </div>
  );
}
