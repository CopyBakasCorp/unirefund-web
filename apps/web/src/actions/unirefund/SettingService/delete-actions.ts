"use server";

import {
  getSettingServiceClient,
  structuredError,
  structuredResponse,
} from "src/lib";

export async function deleteVatByIdApi(id: string) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse = await client.vat.deleteApiSettingServiceVatById({
      id,
    });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteproductGroupByIdApi(id: string) {
  try {
    const client = await getSettingServiceClient();
    const dataResponse =
      await client.productGroup.deleteApiSettingServiceProductGroupById({
        id,
      });
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
