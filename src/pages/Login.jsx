import React from "react";
import { useNavigate} from "react-router-dom";
import { useFormik } from 'formik'; 
import * as Yup from 'yup';
import ApiClass from "../api/api.js";
import SwalClass from "../Common/Swal.js";



const Login = () => {
  let navigate = useNavigate()
  
    // useFormik validations
    const formik = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      validationSchema: Yup.object({
        email: Yup.string()
          .email("Invalid email address")
          .required("Email field is Required."),
        password: Yup.string()
          .required("Password field is required")
          .min(6, "Password is too short - should be 6 chars minimum")
          .matches(
            /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
            "Password must contain at least 8 characters, one uppercase,one lowercase, one number and one special case character"
          ),
      }),
      // API CALLING
      onSubmit: async (body) => {
        const response = await ApiClass.postRequest("login", false, body);

        if (response?.data?.status_code == 1 && response?.data?.data?.token) {
          SwalClass.success(response?.data?.message);
          localStorage.setItem("token", response?.data?.data?.token);
          localStorage.setItem("user", JSON.stringify(response?.data?.data?.user));
          formik.resetForm();
          navigate("/p2p")
          return;
        } 
      },
    });
  
  return (
    <div className="">
      <section className="">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            {/* <!-- AUTH FORM --> */}
            <div className="col-xl-8 col-lg-8 col-md-10">
              <div className="px-4 py-5 px-md-5">
                <form onSubmit={formik.handleSubmit}>
                  {/* <!-- EMAIL --> */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label"> Email{" "}</label>
                    <input type="email" className="form-control shadow-none border-1px" name="email" id="email" placeholder="Email id" onChange={formik.handleChange} value={formik.values.email}/>
                  </div>

                  {formik.errors.email && formik.touched.email && (<span style={{ color: 'red', fontSize: 'small' }}>{formik.errors.email}</span>)}

                  {/* <!-- PASSWORD --> */}
                  <div className="mb-1">
                  <label htmlFor="email" className="form-label"> Password{" "} </label>
                  </div>
                  <div className="input-group mb-3">
                    <input type="text" className="form-control shadow-none border-1px" name="password" id="password" autoComplete="true" placeholder="Password" aria-label="Password" aria-describedby="basic-addon1" onChange={formik.handleChange} value={formik.values.password}/>
                  </div>
 
                  {formik.errors.password && formik.touched.password && (
                            <span style={{ color: 'red', fontSize: 'small' }}>{formik.errors.password}</span>)}

                  {/* <!-- FORGOT PASSWORD --> */}
                  <div className="col-lg-12 col-md-12 col-xl-12 mb-3">
                  </div>

                  {/* <!-- BUTTON --> */}
                    <div className="text-center">
                      <button type="submit" className="btn auth_btn text-black shadow-none text-center" >
                        Sign In
                      </button>
                    </div>

                  {/* <!-- AUTH OPTION --> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;