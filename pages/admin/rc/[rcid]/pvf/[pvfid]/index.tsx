import { Button, Card, Grid, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Meta from "@components/Meta";
import useStore from "@store/store";
import adminPvfRequest, { PvfsParams } from "@callbacks/admin/rc/pvf";

const textFieldColor = "#ff0000";
const textFieldSX = {
  input: {
    "-webkit-text-fill-color": `${textFieldColor} !important`,
    color: `${textFieldColor} !important`,
    fontWeight: "bold",
  },
};

function AdminPvfView() {
  const { token } = useStore();
  const router = useRouter();
  const { rcid } = router.query;
  const PID = router.query.pvfid;

  const rid = (rcid || "").toString();
  const ID = (PID || "").toString();
  const [row, setRow] = useState<PvfsParams>({} as PvfsParams);

  useEffect(() => {
    const getPVFDetails = async () => {
      if (router.isReady) {
        const response = await adminPvfRequest.get(token, rid, ID);
        setRow(response);
      }
    };
    getPVFDetails();
  }, [token, rid, ID, router.isReady]);

  const handleApprove = async () => {
    if (await adminPvfRequest.approve(token, rid, ID)) {
      router.push(`/admin/rc/${rid}/pvfs`);
    }
  };

  const handleReject = async () => {
    if (await adminPvfRequest.reject(token, rid, ID)) {
      router.push(`/admin/rc/${rid}/pvfs`);
    }
  };

  return (
    <div style={{ padding: "0 2rem", marginBottom: 20 }}>
      <Meta title={`${PID} - Proforma Details`} />
      <h2>Proforma</h2>
      <Card
        elevation={5}
        sx={{
          padding: 3,
          width: { xs: "320px", sm: "1000px", margin: "0px auto" },
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Grid container spacing={2} margin={0}>
            <Grid container spacing={2} sx={{ marginBottom: "40px" }}>
              <Grid item xs={12} md={12} key="company-deets">
                <h2 style={{ textAlign: "center" }}>PVF Details</h2>
              </Grid>
              <Grid item xs={12} md={6} key="name" padding={0}>
                <h4>Company / University Name</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.company_university_name}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6} key="address" padding={0}>
                <h4>Role</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.role}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6} key="num-emp" padding={0}>
                <h4>Duration</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.duration}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6} key="social" padding={0}>
                <h4>Mentor Name</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.mentor_name}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6} key="website" padding={0}>
                <h4>Mentor Email</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.mentor_email}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
              <Grid item xs={12} md={6} key="turnover" padding={0}>
                <h4>Mentor Designation</h4>
                <TextField
                  multiline
                  fullWidth
                  value={row.mentor_designation}
                  InputProps={{
                    style: { textAlign: "center" },
                    readOnly: true,
                  }}
                  sx={textFieldSX}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleApprove}
                >
                  Approve
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleReject}
                >
                  Reject
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Stack>
      </Card>
    </div>
  );
}

AdminPvfView.layout = "adminPhaseDashboard";
export default AdminPvfView;
