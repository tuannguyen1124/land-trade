import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Field, reduxForm } from "redux-form";
import { UpdateUser } from "../Profile/EditProfile/actions";

class Info extends Component {
  constructor() {
    super();
    this.handleUpdate = this.handleUpdate.bind(this);
    // this.getStep = this.getStep.bind(this);
    // this.nextStep = this.nextStep.bind(this);
  }

  componentDidMount() {
    const user = this.props.user;
    this.props.change("fullName", user.fullName || "");
    this.props.change("idNumber", user.idNumber || "");
    this.props.change("homeLand", user.homeLand || "");
    this.props.change("birthday", user.birthday || "");
    this.props.change("permanentResidence", user.permanentResidence || "");
    // this.props.change("ethnic", user.ethnic || "");
    // this.props.change("religion", user.religion || "");
    // this.props.change("deformity", user.deformity || "");
    // this.props.change("dateIdNumber", user.dateIdNumber || "");
    // this.props.change("placeIdNumber", user.placeIdNumber || "");
    // this.props.change("phoneNumber", user.phoneNumber || "");
    // this.props.change("email", user.email || "");
  }

  handleUpdate() {
    axios({
      method: "put",
      url: `${process.env.REACT_APP_BASE_URL_API}/users`,
      data: this.props.profile.values,
      headers: {
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    })
      .then((response) => {
        this.props.actUpdate(response.data.data);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        window.location.href = `/verify-account?step=${this.nextStep()}`;
      })
      .catch((err) => alert(err));
  }

  nextStep() {
    return this.getStep() + 1;
  }

  getStep() {
    return Number(new URLSearchParams(location.search).get("step")) || 0;
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="db-add-list-wrap">
              <div className="db-add-listing">
                <form onSubmit={this.props.handleSubmit(this.handleUpdate)}>
                  <div className="row ">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>H??? t??n</label>
                        <Field
                          component="input"
                          name="fullName"
                          type="text"
                          className="form-control filter-input"
                          placeholder="Nh???p H??? t??n"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>S??? CMND/C??n c?????c</label>
                        <Field
                          component="input"
                          name="idNumber"
                          type="text"
                          className="form-control filter-input"
                          placeholder="Nh???p s??? CMND c??n c?????c"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Sinh ng??y</label>
                        <Field
                          component="input"
                          name="birthday"
                          type="text"
                          className="form-control filter-input"
                          placeholder="Sinh ng??y"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Nguy??n qu??n</label>
                        <Field
                          component="input"
                          name="homeLand"
                          type="text"
                          className="form-control filter-input"
                          placeholder="Nguy??n qu??n"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>N??i ??KHK th?????ng tr??</label>
                        <Field
                          component="input"
                          name="permanentResidence"
                          type="text"
                          className="form-control filter-input"
                          placeholder="N??i ??KHK th?????ng tr??"
                        />
                      </div>
                    </div>
                    {/* <div className="col-md-6">
                      <div className="form-group">
                        <label>D??n t???c</label>
                        <Field
                          component="input"
                          name="ethnic"
                          type="text"
                          className="form-control filter-input"
                          placeholder="D??n t???c"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>T??n gi??o</label>
                        <Field
                          component="input"
                          name="religion"
                          type="text"
                          className="form-control filter-input"
                          placeholder="T??n gi??o"
                        />
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>D???u v???t ri??ng v?? d??? h??nh</label>
                        <Field
                          component="input"
                          name="deformity"
                          type="text"
                          className="form-control filter-input"
                          placeholder="D???u v???t ri??ng v?? d??? h??nh"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Ng??y c???p</label>
                        <Field
                          component="input"
                          name="dateIdNumber"
                          type="text"
                          className="form-control filter-input"
                          placeholder="Ng??y c???p"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>N??i c???p</label>
                        <Field
                          component="input"
                          name="placeIdNumber"
                          type="text"
                          className="form-control filter-input"
                          placeholder="N??i c???p"
                        />
                      </div>
                    </div> */}

                    <div className="col-md-12">
                      <button className="btn v3">C???p nh???t</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Info = reduxForm({
  // a unique name for the form
  form: "profile",
})(Info);

const mapStateToProps = (state) => ({
  profile: state.form.profile,
  accessToken: state.login.accessToken,
  user: state.user.data,
});

const mapDispatchToProps = (dispatch) => {
  return {
    actUpdate: (user) => {
      dispatch(UpdateUser(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Info);
