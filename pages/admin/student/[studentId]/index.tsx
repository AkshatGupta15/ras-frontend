import { Card, Grid, Stack, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Meta from "@components/Meta";
import AdminStudentRequest, {
  Student,
} from "@callbacks/admin/student/adminStudent";
import useStore from "@store/store";
import { getDepartment, getProgram } from "@components/Parser/parser";
import DocumentGrid from "@components/DocumentGrid";

const info: { field: string; value: string; disabled: boolean; api_id: any }[] =
  [
    {
      field: "Name",
      value: "Enter your Name",
      disabled: true,
      api_id: "name",
    },
    {
      field: "IITK Email",
      value: "Your IITK email",
      disabled: false,
      api_id: "iitk_email",
    },
    {
      field: "IITK Roll No.",
      value: "Enter your IITK Roll No.",
      disabled: false,
      api_id: "roll_no",
    },
    {
      field: "Expected Graduation Year",
      value: "Select your Graduation Year",
      disabled: false,
      api_id: "expected_graduation_year",
    },
    {
      field: "Department",
      value: "Select your Department",
      disabled: true,
      api_id: "department",
    },
    {
      field: "Program",
      value: "Select your Program",
      disabled: true,
      api_id: "program",
    },
    {
      field: "Secondary Department",
      value: "Select your Department",
      disabled: true,
      api_id: "department_2",
    },
    {
      field: "Secondary Program",
      value: "Select your Program",
      disabled: true,
      api_id: "program_2",
    },
    {
      field: "Specialisation",
      value: "Enter your Specialisation",
      disabled: false,
      api_id: "specialization",
    },
    {
      field: "Preference",
      value: "Select your Preference",
      disabled: false,
      api_id: "preference",
    },
    {
      field: "Gender",
      value: "Select your Gender",
      disabled: false,
      api_id: "gender",
    },
    {
      field: "Personal Email",
      value: "Enter your Personal Email",
      disabled: false,
      api_id: "personal_email",
    },
    {
      field: "DOB",
      value: "Enter your Date of Birth",
      disabled: false,
      api_id: "dob",
    },
    {
      field: "Contact Number",
      value: "Enter your Contact Number",
      disabled: false,
      api_id: "phone",
    },
    {
      field: "Alternate Contact Number",
      value: "Enter your Alternate Contact Number",
      disabled: false,
      api_id: "alternate_phone",
    },
    {
      field: "Whatsapp Number",
      value: "Enter your Whatsapp Number",
      disabled: false,
      api_id: "whatsapp_number",
    },
    {
      field: "Current CPI",
      value: "Enter your Current CPI",
      disabled: false,
      api_id: "current_cpi",
    },
    {
      field: "UG CPI(only for PG Students)",
      value: "Enter your UG CPI",
      disabled: false,
      api_id: "ug_cpi",
    },
    {
      field: "10th Board",
      value: "Enter your 10th Board Name",
      disabled: false,
      api_id: "tenth_board",
    },
    {
      field: "10th Board Year",
      value: "Enter your 10th Board Year",
      disabled: false,
      api_id: "tenth_year",
    },
    {
      field: "10th Marks",
      value: "Enter your 10th Marks",
      disabled: false,
      api_id: "tenth_marks",
    },
    {
      field: "12th Board",
      value: "Enter your 12th Board Name",
      disabled: false,
      api_id: "twelfth_board",
    },
    {
      field: "12th Board Year",
      value: "Enter your 12th Board Year",
      disabled: false,
      api_id: "twelfth_year",
    },
    {
      field: "12th Board Marks",
      value: "Enter your 12th Board Marks",
      disabled: false,
      api_id: "twelfth_marks",
    },
    {
      field: "Entrance Exam",
      value: "Enter your Entrance Exam",
      disabled: false,
      api_id: "entrance_exam",
    },
    {
      field: "Entrance Exam Rank",
      value: "Enter your Entrance Exam Rank",
      disabled: false,
      api_id: "entrance_exam_rank",
    },
    // {
    //   field: "Category",
    //   value: "Enter your Category",
    //   disabled: false,
    //   api_id: "category",
    // },
    // {
    //   field: "Category Rank",
    //   value: "Enter your Category Rank",
    //   disabled: false,
    //   api_id: "category_rank",
    // },
    {
      field: "Current Address",
      value: "Enter your Current Address",
      disabled: false,
      api_id: "current_address",
    },
    {
      field: "Permanent Address",
      value: "Enter your Permanent Address",
      disabled: false,
      api_id: "permanent_address",
    },
    {
      field: "Friends Name",
      value: "Enter your Friends Name",
      disabled: false,
      api_id: "friend_name",
    },
    {
      field: "Friends Contact Details",
      value: "Enter your Friends Contace Details",
      disabled: false,
      api_id: "friend_phone",
    },
    {
      field: "Disability",
      value: "Select your Disability Status",
      disabled: false,
      api_id: "disability",
    },
  ];
function Details() {
  const [StudentData, setStudentData] = useState<Student>({ ID: 0 } as Student);
  const { role, token } = useStore();
  const router = useRouter();
  const { studentId } = router.query;
  const sId = (studentId || "").toString();

  const verify = async () => {
    await AdminStudentRequest.verify(token, sId, true);
  };
  const unVerify = async () => {
    await AdminStudentRequest.verify(token, sId, false);
  };

  const makeEditable = async () => {
    await AdminStudentRequest.makeEditable(token, sId);
  };

  useEffect(() => {
    const fetch = async () => {
      const student = await AdminStudentRequest.get(
        token,
        parseInt(sId, 10)
      ).catch(() => ({ ID: 0 } as Student));
      setStudentData(student);
    };
    if (router.isReady) fetch();
  }, [token, sId, router.isReady]);

  const handleValue = (val: string) => {
    switch (val) {
      case "dob":
        return new Date(StudentData.dob).toLocaleDateString("en-GB");
      case "program":
        return getProgram(StudentData.program_department_id);
      case "program_2":
        return getProgram(StudentData.secondary_program_department_id);
      case "department":
        return getDepartment(StudentData.program_department_id);
      case "department_2":
        return getDepartment(StudentData.secondary_program_department_id);
      default:
        return StudentData[val as keyof Student];
    }
  };

  return (
    <div>
      <Meta title={`${StudentData.name} - Master Student Details`} />
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <h2>Profile</h2>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Button
              href={`${sId}/edit`}
              variant="contained"
              sx={{ width: 100 }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              sx={{ width: 100 }}
              onClick={() => {
                verify();
                router.push("/admin/student");
              }}
            >
              Verify
            </Button>
            <Button
              variant="contained"
              sx={{ width: 100 }}
              onClick={() => {
                unVerify();
                router.push("/admin/student");
              }}
              color="error"
            >
              Unverify
            </Button>
            {StudentData.is_editable ? (
              <Button variant="contained" sx={{ width: 100 }} color="error">
                Student can edit details
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{ width: 100 }}
                onClick={() => {
                  makeEditable();
                  router.push("/admin/student");
                }}
                color="error"
              >
                Give Edit Access
              </Button>
            )}
          </Stack>
        </Stack>
        <Stack justifyContent="center">
          <Card
            elevation={5}
            sx={{
              padding: 3,
              borderRadius: "10px",
              width: { xs: "330px", sm: "600px", margin: "0px auto" },
            }}
          >
            <Grid container spacing={5} sx={{ padding: 3 }}>
              {info.map((item) =>
                !(
                  role === 103 &&
                  (item.field === "Entrance Exam Rank" ||
                    item.field === "Category" ||
                    item.field === "Category Rank")
                ) ? (
                  <Grid item xs={12} sm={6} key={item.field}>
                    <p>{item.field}</p>
                    <TextField
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      id="standard-basic"
                      variant="standard"
                      value={handleValue(item.api_id)}
                      multiline={
                        item.field === "Current Address" ||
                        item.field === "Permanent Address"
                      }
                      minRows={3}
                    />
                  </Grid>
                ) : (
                  <Grid />
                )
              )}
            </Grid>
          </Card>
        </Stack>
      </Stack>
      <div className="" style={{ margin: "2rem 0" }}>
        <h2>Documents</h2>
        <DocumentGrid studentId={studentId as string} />
      </div>
    </div>
  );
}

Details.layout = "adminDashBoard";
export default Details;
