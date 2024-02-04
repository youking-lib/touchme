import { Errors } from "./error";

export const noBody = () => {
  return Response.json(
    { error: Errors.NoBody, success: false },
    {
      status: 400,
    }
  );
};

export const invalidBody = () => {
  return Response.json(
    { error: Errors.InvalidBody, success: false },
    {
      status: 400,
    }
  );
};

export const notAllowed = () => {
  return Response.json(
    { error: Errors.NotAllowed, success: false },
    {
      status: 400,
    }
  );
};

export const success = (data?: object | null, init?: ResponseInit) => {
  return Response.json(
    {
      success: true,
      data,
    },
    init
  );
};
