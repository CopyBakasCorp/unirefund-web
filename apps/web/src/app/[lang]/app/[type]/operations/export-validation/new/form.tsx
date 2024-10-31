"use client";
import { toast } from "@/components/ui/sonner";
import type { UniRefund_CRMService_Customss_CustomsProfileDto } from "@ayasofyazilim/saas/CRMService";
import type { UniRefund_ExportValidationService_ExportValidations_CreateExportValidationDto } from "@ayasofyazilim/saas/ExportValidationService";
import { $UniRefund_ExportValidationService_ExportValidations_CreateExportValidationDto } from "@ayasofyazilim/saas/ExportValidationService";
import type { UniRefund_TagService_Tags_TagListItemDto } from "@ayasofyazilim/saas/TagService";
import { createZodObject } from "@repo/ayasofyazilim-ui/lib/create-zod-object";
import AutoForm, {
  AutoFormSubmit,
  createFieldConfigWithResource,
  CustomCombobox,
} from "@repo/ayasofyazilim-ui/organisms/auto-form";
import { useRouter } from "next/navigation";
import { postExportValidationApi } from "src/app/[lang]/app/actions/ExportValidationService/post-actions";
import type { ExportValidationServiceResource } from "src/language-data/ExportValidationService";
import { getBaseLink } from "src/utils";

const ExportValidationSchema = createZodObject(
  $UniRefund_ExportValidationService_ExportValidations_CreateExportValidationDto,
  [
    "tagId",
    "exportLocationId",
    "referenceId",
    "exportDate",
    "status",
    "stampType",
    "initialValidationResult",
    "finalValidationResult",
  ],
);

export default function Page({
  languageData,
  CustomsData,
  TagsData,
}: {
  languageData: ExportValidationServiceResource;
  CustomsData: UniRefund_CRMService_Customss_CustomsProfileDto[];
  TagsData: UniRefund_TagService_Tags_TagListItemDto[];
}) {
  const router = useRouter();

  const translatedForm = createFieldConfigWithResource({
    schema:
      $UniRefund_ExportValidationService_ExportValidations_CreateExportValidationDto,
    resources: languageData,
    extend: {
      exportLocationId: {
        renderer: (props) => (
          <CustomCombobox<UniRefund_CRMService_Customss_CustomsProfileDto>
            childrenProps={props}
            emptyValue={languageData["Custom.Select"]}
            list={CustomsData}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="name"
          />
        ),
      },
      tagId: {
        renderer: (props) => (
          <CustomCombobox<UniRefund_TagService_Tags_TagListItemDto>
            childrenProps={props}
            emptyValue={languageData["Tag.Select"]}
            list={TagsData}
            searchPlaceholder={languageData["Select.Placeholder"]}
            searchResultLabel={languageData["Select.ResultLabel"]}
            selectIdentifier="id"
            selectLabel="tagNumber"
          />
        ),
      },
    },
  });

  async function createExportValidation(
    data: UniRefund_ExportValidationService_ExportValidations_CreateExportValidationDto,
  ) {
    const response = await postExportValidationApi({ requestBody: data });
    if (response.type === "error" || response.type === "api-error") {
      toast.error(
        response.message || languageData["ExportValidation.New.Error"],
      );
    } else {
      toast.success([languageData["ExportValidation.New.Success"]]);
      router.push(getBaseLink(`/app/admin/operations/export-validation`));
    }
  }
  return (
    <AutoForm
      fieldConfig={translatedForm}
      formSchema={ExportValidationSchema}
      onSubmit={(val) => {
        void createExportValidation(val);
      }}
      stickyChildren
    >
      <AutoFormSubmit className="float-right px-8 py-4">
        {languageData.Save}
      </AutoFormSubmit>
    </AutoForm>
  );
}