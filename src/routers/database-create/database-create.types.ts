export type FormState = {
  dbType: "mysql" | "postgres" | null;
  dbName: string;
  // MySQL specific
  mysqlCharset: string;
  mysqlCollation: string;
  // PostgreSQL specific
  postgresOwner: string;
  postgresEncoding: string;
};

export type StepProps = {
  formData: FormState;
  setFormData: React.Dispatch<React.SetStateAction<FormState>>;
};
