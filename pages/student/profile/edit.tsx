import {
  Autocomplete,
  Button,
  Card,
  Grid,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

import Meta from "@components/Meta";
import studentRequest, { Student } from "@callbacks/student/student";
import useStore from "@store/store";
import { Branches, func, programType } from "@components/Utils/matrixUtils";
import { getId } from "@components/Parser/parser";

function ProfileEdit() {
  const [StudentData, setStudentData] = useState<Student>({ ID: 0 } as Student);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<Student>({
    defaultValues: StudentData,
  });
  const [dept, setDept] = useState<any>("");
  const [deptSec, setDeptSec] = useState<any>("");

  const { token } = useStore();
  const router = useRouter();
  useEffect(() => {
    const fetch = async () => {
      const student = await studentRequest
        .get(token)
        .catch(() => ({ ID: 0 } as Student));

      setStudentData(student);
      reset(student);
    };
    fetch();
  }, [token, reset]);

  const onSubmit = async (data: Student) => {
    let program_department_id = getId(
      getValues("program"),
      getValues("department")
    );

    let secondary_program_department_id = getId(
      getValues("program_2"),
      getValues("department_2")
    );

    if (secondary_program_department_id === 200)
      secondary_program_department_id = 0;

    const response = await studentRequest.update(token, {
      ...data,
      program_department_id,
      secondary_program_department_id,
    });

    if (response) {
      router.push("/student/profile");
    }
  };
  return (
    <div>
      <Meta title="Edit Profile - Student Dashboard " />
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
          spacing={2}
        >
          <h2>Edit Profile</h2>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={2}
          >
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{ width: 100 }}
            >
              Save
            </Button>

            <Button
              variant="contained"
              sx={{ width: 150 }}
              color={StudentData.is_verified ? "success" : "error"}
            >
              {StudentData.is_verified === true ? "Verified" : "Not Verified"}
            </Button>
          </Stack>
        </Stack>
        <h3 style={{ fontWeight: 300 }}>
          Please fill in corresponding details <b>only</b> for the fields you
          want to edit.
        </h3>
        <h4 style={{ fontWeight: 300 }}>
          PS. If your profile is already verified, it will be reverted upon any
          change.
        </h4>
        <h4 style={{ fontWeight: 500 }}>
          Already verified students registering for the new placement season can
          edit some of the allowed fields below
        </h4>
        <form style={{ marginBottom: 10 }}>
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
                <Grid item xs={12} sm={6}>
                  <p>Name</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    disabled
                    {...register("name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>IITK Email</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    disabled
                    {...register("iitk_email")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>IITK Roll No.</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    disabled
                    {...register("roll_no")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Expected Year of Graduation</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.expected_graduation_year}
                    helperText={
                      errors.expected_graduation_year
                        ? "Year doesnt lie in required range!"
                        : ""
                    }
                    {...register("expected_graduation_year", {
                      setValueAs: (value) => parseInt(value, 10),
                      max: 9999,
                      min: 1000,
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Department</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("department")}
                    onChange={(e) => {
                      setDept(e.target.value);
                    }}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="" />
                    <MenuItem value="NA">None</MenuItem>
                    {Branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Program</p>
                  {dept !== "" ? (
                    <Select
                      fullWidth
                      variant="standard"
                      {...register("program")}
                      disabled={StudentData.is_verified}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                      {dept !== "" &&
                        dept !== "NA" &&
                        Object.keys(func[dept as keyof typeof func]).map(
                          (program: any) => {
                            if (
                              func[dept as keyof typeof func][
                                program as keyof programType
                              ] !== -1
                            ) {
                              return (
                                <MenuItem key={program} value={program}>
                                  {program}
                                </MenuItem>
                              );
                            }
                            return null;
                          }
                        )}
                    </Select>
                  ) : (
                    <Select
                      fullWidth
                      variant="standard"
                      {...register("program")}
                      disabled={StudentData.is_verified}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                    </Select>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Secondary Department</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("department_2")}
                    onChange={(e) => {
                      setDeptSec(e.target.value);
                    }}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="" />
                    <MenuItem value="NA">None</MenuItem>
                    {Branches.map((branch) => (
                      <MenuItem key={branch} value={branch}>
                        {branch}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Secondary Program</p>
                  {deptSec !== "" ? (
                    <Select
                      fullWidth
                      variant="standard"
                      {...register("program_2")}
                      disabled={StudentData.is_verified}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                      {deptSec !== "" &&
                        deptSec !== "NA" &&
                        Object.keys(func[deptSec as keyof typeof func]).map(
                          (program: any) => {
                            if (
                              func[deptSec as keyof typeof func][
                                program as keyof programType
                              ] !== -1
                            ) {
                              return (
                                <MenuItem key={program} value={program}>
                                  {program}
                                </MenuItem>
                              );
                            }
                            return null;
                          }
                        )}
                    </Select>
                  ) : (
                    <Select
                      fullWidth
                      variant="standard"
                      {...register("program_2")}
                      disabled={StudentData.is_verified}
                    >
                      <MenuItem value="" />
                      <MenuItem value="NA">None</MenuItem>
                    </Select>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Specialization</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("specialization")}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <p>Preference</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("preference")}
                  >
                    <MenuItem value="" />
                    <MenuItem value="Academic">Academic</MenuItem>
                    <MenuItem value="Industrial">Industrial</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Gender</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("gender")}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="" />
                    <MenuItem value="NA">None</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Personal Email</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("personal_email")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Date Of Birth</p>
                  <TextField
                    fullWidth
                    type="date"
                    id="standard-basic"
                    variant="standard"
                    {...register("dob", {
                      setValueAs: (date) => {
                        const d = new Date(date);
                        const epoch = d.getTime();
                        return epoch;
                      },
                    })}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Contact Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.phone}
                    helperText={
                      errors.phone ? "Contact No. must contain 10 digits!" : ""
                    }
                    {...register("phone", { minLength: 10, maxLength: 10 })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Alternate Contact Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.alternate_phone}
                    helperText={
                      errors.phone
                        ? "Alternate Contact No. must contain 10 digits!"
                        : ""
                    }
                    {...register("alternate_phone", {
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Whatsapp Number</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.whatsapp_number}
                    helperText={
                      errors.phone
                        ? "Whatsapp Contact No. must contain 10 digits!"
                        : ""
                    }
                    {...register("whatsapp_number", {
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Current CPI</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("current_cpi", {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>UG CPI(only for PG Students)</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("ug_cpi", {
                      setValueAs: (value) => parseFloat(value),
                    })}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>10th Board</p>
                  <Autocomplete
                    freeSolo
                    options={["CBSE", "ICSE", "Please Specify"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        {...register("tenth_board")}
                      />
                    )}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>10th Board Year</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.tenth_year}
                    helperText={
                      errors.tenth_year
                        ? "Year doesnt lie in required range!"
                        : ""
                    }
                    {...register("tenth_year", {
                      setValueAs: (value) => parseInt(value, 10),
                      max: 9999,
                      min: 1000,
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>10th Marks (CGPA / Percentage)</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("tenth_marks", {
                      setValueAs: (value) => parseFloat(value),
                      min: 0,
                      max: 100,
                    })}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>12th Board</p>
                  <Autocomplete
                    freeSolo
                    options={["CBSE", "ICSE", "Please Specify"]}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="standard"
                        {...register("twelfth_board")}
                      />
                    )}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>12th Board Year</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    error={!!errors.twelfth_year}
                    helperText={
                      errors.twelfth_year
                        ? "Year doesnt lie in required range!"
                        : ""
                    }
                    {...register("twelfth_year", {
                      setValueAs: (value) => parseInt(value, 10),
                      max: 9999,
                      min: 1000,
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>12th Marks (CGPA / Percentage)</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("twelfth_marks", {
                      setValueAs: (value) => parseFloat(value),
                      min: 0,
                      max: 100,
                    })}
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Entrance Exam</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("entrance_exam")}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="" />
                    <MenuItem value="NA">None</MenuItem>

                    <MenuItem value="JEE Advanced">JEE Advanced</MenuItem>
                    <MenuItem value="GATE">GATE</MenuItem>
                    <MenuItem value="JAM">JAM</MenuItem>
                    <MenuItem value="CEED">CEED</MenuItem>
                    <MenuItem value="JMET">CAT</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Entrance Exam Rank</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    {...register("entrance_exam_rank", {
                      setValueAs: (value) => parseInt(value, 10),
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                    disabled={StudentData.is_verified}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <p>Category</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("category")}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="" />
                    <MenuItem value="NA">None</MenuItem>

                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="General-EWS">General-EWS</MenuItem>
                    <MenuItem value="OBC">OBC</MenuItem>
                    <MenuItem value="SC">SC</MenuItem>
                    <MenuItem value="ST">ST</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Category Rank</p>
                  <TextField
                    fullWidth
                    type="number"
                    id="standard-basic"
                    variant="standard"
                    {...register("category_rank", {
                      setValueAs: (value) => parseInt(value, 10),
                    })}
                    onWheel={(event) =>
                      (event.target as HTMLTextAreaElement).blur()
                    }
                    disabled={StudentData.is_verified}
                  /> */}
                {/* </Grid> */}
                <Grid item xs={12} sm={6}>
                  <p>Current Address</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    multiline
                    minRows={3}
                    {...register("current_address")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Permanent Address</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    multiline
                    minRows={3}
                    {...register("permanent_address")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Friend Name</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    variant="standard"
                    {...register("friend_name")}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Friend Contact Details</p>
                  <TextField
                    fullWidth
                    type="text"
                    id="standard-basic"
                    error={!!errors.friend_phone}
                    helperText={
                      errors.friend_phone
                        ? "Contact number must be 10 digits long!"
                        : ""
                    }
                    variant="standard"
                    {...register("friend_phone", {
                      minLength: 10,
                      maxLength: 10,
                    })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <p>Disability</p>
                  <Select
                    fullWidth
                    variant="standard"
                    {...register("disability")}
                    disabled={StudentData.is_verified}
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </Grid>
              </Grid>
            </Card>
          </Stack>
        </form>
      </Stack>
    </div>
  );
}

ProfileEdit.layout = "studentDashboard";
export default ProfileEdit;
