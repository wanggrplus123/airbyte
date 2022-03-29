import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import PageTitle from "components/PageTitle";
import SourceForm from "./components/SourceForm";
import useRouter from "hooks/useRouter";
import useSource from "hooks/services/useSourceHook";
import { FormPageContent } from "components/ConnectorBlocks";
import { ConnectionConfiguration } from "core/domain/connection";
import HeadTitle from "components/HeadTitle";
import { JobInfo } from "core/domain/job/Job";
import { useSourceDefinitionList } from "services/connector/SourceDefinitionService";

const CreateSourcePage: React.FC = () => {
  const { push } = useRouter();
  const [successRequest, setSuccessRequest] = useState(false);
  const [errorStatusRequest, setErrorStatusRequest] = useState<{
    status: number;
    response: JobInfo;
  } | null>(null);

  const { sourceDefinitions } = useSourceDefinitionList();
  const { createSource } = useSource();

  const onSubmitSourceStep = async (values: {
    name: string;
    serviceType: string;
    connectionConfiguration?: ConnectionConfiguration;
  }) => {
    const connector = sourceDefinitions.find(
      (item) => item.sourceDefinitionId === values.serviceType
    );
    setErrorStatusRequest(null);
    try {
      const result = await createSource({ values, sourceConnector: connector });
      setSuccessRequest(true);
      setTimeout(() => {
        setSuccessRequest(false);
        push(`../${result.sourceId}`);
      }, 2000);
    } catch (e) {
      setErrorStatusRequest(e);
    }
  };

  return (
    <>
      <HeadTitle titles={[{ id: "sources.newSourceTitle" }]} />
      <PageTitle
        withLine
        title={<FormattedMessage id="sources.newSourceTitle" />}
      />
      <FormPageContent>
        <SourceForm
          afterSelectConnector={() => setErrorStatusRequest(null)}
          onSubmit={onSubmitSourceStep}
          sourceDefinitions={sourceDefinitions}
          hasSuccess={successRequest}
          error={errorStatusRequest}
        />
      </FormPageContent>
    </>
  );
};

export default CreateSourcePage;
