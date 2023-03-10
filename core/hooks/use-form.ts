/*
 * This React hook utilizes the Zod library to handle form validation and data management.
 * It requires the use of schemas and fields to function properly,
 * which must be matched correctly.
 * The on-submit function will fire when the handleSubmit method is triggered,
 * providing necessary data like the results to be utilized by the client.
 */

import { useEffect, useState } from "react";
import { z, type ZodFormattedError } from "zod";

type Payload<Schema> = {
  schema: z.Schema<Schema>;
  fields: Schema;
  onSubmit: (result: z.SafeParseReturnType<Schema, Schema>) => void;
};

type Status = "neutral" | "invalid" | "valid";

const useForm = <Schema>({ schema, fields, onSubmit }: Payload<Schema>) => {
  type Errors = ZodFormattedError<Schema> | undefined;
  const [errors, setErrors] = useState<Errors>(undefined);
  const [status, setStatus] = useState<Status>("neutral");

  const handleValidation = () => {
    const result = schema.safeParse(fields);
    if (!result.success) {
      setErrors(result.error.format());
      setStatus("invalid");
    } else {
      setErrors(undefined);
      setStatus("valid");
    }
    return result;
  };

  type Event = React.MouseEvent<HTMLButtonElement, MouseEvent>;
  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const result = handleValidation();
    onSubmit(result);
  };

  useEffect(() => {
    status !== "neutral" && handleValidation();
  }, [fields]);

  return { handleSubmit, status, errors };
};

export default useForm;
