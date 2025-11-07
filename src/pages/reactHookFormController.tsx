import * as React from "react";
import { useForm, useController, type UseControllerProps } from "react-hook-form";

type FormValues = {
  FirstName: string;
};

function Input(props: UseControllerProps<FormValues>) {
  const { field, fieldState } = useController(props);

  return (
    <div className="border">
      <input {...field} placeholder={props.name} />
      <p>{fieldState.isTouched && "Touched"}</p>
      <p>{fieldState.isDirty && "Dirty"}</p>
      <p>{fieldState.invalid ? "invalid" : "valid"}</p>
    </div>
  );
}

export default function ReactCTL() {
  const { handleSubmit, control } = useForm<FormValues>({
    defaultValues: {
      FirstName: "",
    },
    mode: "onChange",
  });
  const onSubmit = (data: FormValues) => console.log(data);

  return (
    <form
      className="flex flex-col p-8 items-center space-y-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input control={control} name="FirstName" rules={{ required: true }} />
      <input className="border" type="submit" />
    </form>
  );
}
