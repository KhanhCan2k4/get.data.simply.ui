export type Column = {
  id: number;
  name: string;
  dataType: string;
  length: string;
  defaultValue: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  isForeignKey?: boolean;
  isAutoIncrement: boolean;
};
