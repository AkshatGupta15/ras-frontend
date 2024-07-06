import { Button, Container, Stack, Tooltip } from "@mui/material";
import Grid from "@mui/material/Grid";
import { GridColDef } from "@mui/x-data-grid";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import adminPvfRequest, {
  AllStudentPvfResponse,
} from "@callbacks/admin/rc/pvf";
import DataGrid from "@components/DataGrid";
import Meta from "@components/Meta";
import useStore from "@store/store";
import { CDN_URL } from "@callbacks/constants";
import AskClarification from "@components/Modals/clarification";

const transformName = (name: string) => {
  const nname = name.replace(`${CDN_URL}/view/`, "");
  const nameArray = nname.split(".");
  const newName = nameArray[0].slice(14, -33);
  const newNameWithExtension = `${newName}.${nameArray[1]}`;
  return newNameWithExtension;
};

const getURL = (url: string) => `${CDN_URL}/view/${url}`;

function RejectResumeButton(props: {
  id: string;
  updateCallback: () => Promise<void>;
}) {
  const { token } = useStore();
  const { id, updateCallback } = props;
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  return (
    <Button
      variant="contained"
      onClick={() => {
        adminPvfRequest
          .putVerify(token, rid, id, { verified: false })
          .then(() => {
            updateCallback();
          });
      }}
    >
      Reject
    </Button>
  );
}

function GenerateAuthButton(props: {
  id: string;
  updateCallback: () => Promise<void>;
}) {
  const { token } = useStore();
  const { id, updateCallback } = props;
  return (
    <Button
      variant="contained"
      sx={{
        marginInlineEnd: "0.5rem",
      }}
      onClick={() => {
        adminPvfRequest.generateAuth(token, id).then(() => {
          updateCallback();
        });
      }}
    >
      Generate Auth
    </Button>
  );
}

const columns: GridColDef[] = [
  {
    field: "pvfid",
    headerName: "PVF ID",
  },
  {
    field: "CreatedAt",
    headerName: "Created At",
    hide: true,
  },
  {
    field: "UpdatedAt",
    headerName: "Updated At",
    hide: true,
  },
  {
    field: "name",
    headerName: "Student Name",
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <div>{params.value}</div>
      </Tooltip>
    ),
  },
  {
    field: "email",
    headerName: "Student Email",
    renderCell: (params) => (
      <Tooltip title={params.value}>
        <div>{params.value}</div>
      </Tooltip>
    ),
  },
  {
    field: "roll_no",
    headerName: "Student Roll No",
  },
  {
    field: "pvf",
    headerName: "PVF Link",
    sortable: false,
    align: "center",
    width: 400,
    headerAlign: "center",
    valueGetter: (params) => getURL(params?.value),
    renderCell: (params) => (
      <Button
        variant="contained"
        sx={{ width: "100%" }}
        onClick={() => {
          window.open(params.value, "_blank");
        }}
      >
        {transformName(params.value)}
      </Button>
    ),
  },
  {
    field: "verified",
    headerName: "Verification Status",
    align: "center",
    headerAlign: "center",
    valueGetter: ({ value }) => {
      if (value?.Valid) {
        if (value?.Bool) return "Accepted";
        return "Rejected";
      }
      if (!value?.Valid) return "Pending Verification";
      return "Unknown";
    },
  },
  {
    field: "action_taken_by",
    headerName: "Action Taken By",
    align: "center",
    headerAlign: "center",
    hide: true,
  },
  {
    field: "AskClarification",
    headerName: "Ask Clarification",
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <AskClarification role={role} sid={params.row.sid} row={params.row} />
    ),
  },
  {
    field: "options",
    headerName: "",
    align: "center",
    renderCell: (cellValues) => {
      if (!cellValues.row.verified?.Valid || role === 100 || role === 101) {
        return (
          <Container>
            <GenerateAuthButton
              id={cellValues.id.toString()}
              updateCallback={updateTable}
            />
            <RejectResumeButton
              id={cellValues.id.toString()}
              updateCallback={updateTable}
            />
          </Container>
        );
      }
    },
  },
];

function Index() {
  const [allPvfs, setAllPvfs] = useState<AllStudentPvfResponse[]>([]);
  const router = useRouter();
  const { rcid } = router.query;
  const rid = (rcid || "").toString();
  const { token, rcName, role } = useStore();

  useEffect(() => {
    const fetchData = async () => {
      if (rid === undefined || rid === "") return;
      const res = await adminPvfRequest.getAll(token);
      if (res !== null && res?.length > 0) setAllPvfs(res);
      else setAllPvfs([]);
    };
    fetchData();
  }, [token, rid]);

  const updateTable = React.useCallback(async () => {
    if (rid === undefined || rid === "") return;
    const res = await adminPvfRequest.getAll(token);
    if (res !== null && res?.length > 0) setAllPvfs(res);
    else setAllPvfs([]);
  }, [token, rid]);

  return (
    <div>
      <Meta title={`PVF Dashboard - ${rcName}`} />
      <Grid container alignItems="center">
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <h2>PVF</h2>
          </Stack>
        </Grid>

        <DataGrid
          rows={allPvfs}
          getRowId={(row) => row.pvfid}
          columns={columns}
        />
      </Grid>
    </div>
  );
}

Index.layout = "adminPhaseDashBoard";
export default Index;
