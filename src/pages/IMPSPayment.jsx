import React, { useState, useEffect } from "react";
import ApiClass from "../api/api";
import SwalClass from "../Common/Swal";
import Form from "../Common/Form.js";
import { Link } from "react-router-dom";

export default function IMPSPayment() {
  const [pymData, setPymData] = useState({});
  const query = new URLSearchParams(window.location.search);
  let id = query.get("id");

  const getById = async () => {
    const reasult = await ApiClass.getNodeRequest(
      `P2P/paymentType/getById?id=${id}`,
      true
    );
    if (reasult?.data?.status_code == 0) {
      SwalClass.error(reasult?.data?.message);
      return;
    }
    if (reasult?.data?.status_code == 1) {
      setPymData(reasult?.data?.data);
    }
  };

  useEffect(() => {
    if (Object.keys(pymData).length != 0) {
      createDynamicForm();
    }
  }, [pymData]);

  const formSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const setData = {};
    for (const pair of formData.entries()) {
      setData[pair[0]] = pair[1];
    }
    setData.currency = pymData?.currency;
    setData.payment_slug = pymData?.slug;
    const res = await ApiClass.postNodeRequest(
      "p2p/paymentType/create-payment",
      true,
      setData
    );

    if (res?.data?.status_code == 0) {
      SwalClass.error(res?.data?.message);
      return;
    }
    if (res?.data?.status_code == 1) {
      SwalClass.success(res?.data.message);
      document.getElementById("dynamicForm").reset();
    }
  };

  const createDynamicForm = async () => {
    let formExist = document.getElementById("dynamicForm");
    if (formExist != null) {
      formExist.remove();
    }
    const css_class = {
      form: ["payment_form"],
      input: ["form-control", "mb-3"],
      button: ["btn", "border", "w-100"],
      select: ["form-select", "mb-3"],
    };
    Form.createForm({
      targetDiv: "renderForm",
      formID: "dynamicForm",
      array_data: pymData?.form_field,
      css_class: css_class,
      func: formSubmit,
      btnId: "submit_btn",
    });
  };

  useEffect(() => {
    getById();
  }, []);

  return (
    <div>
      <div className="payment_box my-2">
        <div className="container">
          <div className="row justify-content-center payment_row align-items-center">
            <div className="col-md-8 col-lg-6">
              <div style={{marginLeft:"15px",paddingBottom:"10px"}}>
                <Link to="/payment">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="25"
                    viewBox="0 96 960 960"
                    width="25"
                  >
                    <path d="M480 896 160 576l320-320 42 42-248 248h526v60H274l248 248-42 42Z" />
                  </svg>
                </Link>
              </div>
              <div className="payment_inner_box p-4">
                <div className="payment_heading mb-4">
                  <h6 className="d-flex align-items-center gap-2">
                    <span></span> {pymData?.type}
                  </h6>
                </div>
                <div id="renderForm"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
