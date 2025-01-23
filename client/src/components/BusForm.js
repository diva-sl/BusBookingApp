import { React, useEffect } from "react";
import { Col, Form, message, Modal, Row, Select } from "antd";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/AlertSlice";
import axios from "axios";
import config from "../config";

function BusForm({
  showBusForm,
  setShowBusForm,
  type,
  selectedBus,
  refreshBuses,
}) {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  useEffect(() => {
    if (type === "add") {
      form.resetFields();
    } else if (type === "edit" && selectedBus) {
      form.setFieldsValue(selectedBus);
    }
  }, [type, selectedBus, form, showBusForm]);

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const url =
        type === "add"
          ? `${config.API_BASE_URL}/buses/add-bus`
          : `${config.API_BASE_URL}/buses/update-bus`;
      const payload =
        type === "add" ? values : { ...values, _id: selectedBus._id };

      const response = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      dispatch(hideLoading());
      if (response.data.success) {
        refreshBuses();
        message.success(response.data.message);
        setShowBusForm(false);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something went wrong");
    }
  };

  return (
    <Modal
      width={800}
      title={type === "add" ? "Add Bus" : "Update Bus"}
      open={showBusForm}
      onCancel={() => {
        setShowBusForm(false);
      }}
      footer={false}
      style={{ padding: "20px" }}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        style={{
          padding: "10px",
          background: "rgb(131,34,54,0,1)",
          borderRadius: "5px",
        }}
      >
        <Row gutter={[10, 10]}>
          <Col lg={12} xs={24}>
            <Form.Item label="Bus Name" name="name">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Bus Number" name="number">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>

          <Col lg={12} xs={24}>
            <Form.Item label="From" name="from">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="To" name="to">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Journey Date" name="journeyDate">
              <input
                type="date"
                style={{
                  width: "95%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Departure" name="departure">
              <input
                type="time"
                style={{
                  width: "95%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              ></input>
            </Form.Item>
          </Col>
          <Col lg={8} xs={24}>
            <Form.Item label="Arrival" name="arrival">
              <input
                type="time"
                style={{
                  width: "95%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Type" name="type">
              <Select
                placeholder="Select Type"
                style={{
                  width: "90%",
                  height: "41px",
                  background: "white",
                  border: "1.5px solid black",
                  borderRadius: "5px",
                }}
              >
                <Select.Option value="AC">AC</Select.Option>
                <Select.Option value="Non-AC">Non-AC</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Fare" name="fare">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Capacity" name="capacity">
              <input
                type="text"
                style={{
                  width: "90%",
                  height: "35px",
                  background: "white",
                  borderRadius: "5px",
                }}
              />
            </Form.Item>
          </Col>
          <Col lg={12} xs={24}>
            <Form.Item label="Status" name="status">
              <Select
                name=""
                placeholder="Select Status"
                style={{
                  width: "90%",
                  height: "41px",
                  background: "white",
                  border: "1.5px solid black",
                  borderRadius: "5px",
                }}
              >
                <Select.Option value="Yet To Start">Yet To Start</Select.Option>
                <Select.Option value="Running">Running</Select.Option>
                <Select.Option value="Completed">Completed</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              background: "royalblue",
              textTransform: "none",
              padding: "8px 20px",
              color: "white",
            }}
            type="submit"
          >
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
}
export default BusForm;
