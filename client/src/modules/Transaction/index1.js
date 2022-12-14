import React, { useState, useEffect } from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiExpansionPanel from "@material-ui/core/ExpansionPanel";
import MuiExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import MuiExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import { connect } from "react-redux";

import Info from "./sections/1_info";
import DepositContract from "./sections/2_deposit_contract";
import DepositPayment from "./sections/3_deposit_payment";
import DepositConfirm from "./sections/4_deposit_confirm";
import TransferContract from "./sections/5_transfer_contract";
import PaymentConfirm from "./sections/6_payment_confirm";
import PayTaxes from "./sections/7_pay_taxes";
import TaxesConfirm from "./sections/8_taxes_confirm";
import Finished from "./sections/9_finished";

import BuyerAcceptTransaction from "./buyer/acceptTransaction";
import BuyerConfirmTransaction from "./buyer/confirmTransaction";
import BuyerPayment from "./buyer/payment";

import SellerAcceptTransaction from "./seller/acceptTransaction";
import SellerConfirmTransaction from "./seller/confirmTransaction";
import SellerPayment from "./seller/payment";

import {
  fetchTransactionRequest,
  cancelTransactionRequest,
  acceptTransactionSuccess,
  paymentTransactionSuccess,
  confirmTransactionSuccess,
  cancelTransactionSuccess,
} from "./action";

const ExpansionPanel = withStyles({
  root: {
    border: "1px solid rgba(0, 0, 0, .125)",
    boxShadow: "none",
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&$expanded": {
      margin: "auto",
    },
  },
  expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    marginBottom: -1,
    minHeight: 56,
    "&$expanded": {
      minHeight: 56,
    },
  },
  content: {
    "&$expanded": {
      margin: "12px 0",
    },
  },
  expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiExpansionPanelDetails);

const CustomizedExpansionPanels = (props) => {
  const [expanded, setExpanded] = useState(false);
  const PARTY_CONSTANT = {
    BUYER: "BUYER",
    SELLER: "SELLER",
    OUT_TRANSACTION: "OUT_TRANSACTION",
  };
  const [party, setParty] = useState(PARTY_CONSTANT.OUT_TRANSACTION); // party: BUYER - SELLER - OUT_TRANSACTION
  const txHash = props.match.params.txHash;
  useEffect(() => {
    props.fetchTransaction(txHash);
  }, []);

  useEffect(() => {
    if (props.user.publicAddress.includes(props.transaction.sellers)) {
      setParty("SELLER");
    } else if (props.user.publicAddress.includes(props.transaction.buyers)) {
      setParty("BUYER");
    }
  });

  // useEffect(() => {
  //   // listen event TransactionCreated from blockchain and emit event INIT_TRANSACTION_SUCCESS
  //   if (props.transactionContract) {
  //     console.log(props.transactionContract);
  //     props.transactionContract.events
  //       .DepositSigned()
  //       .on("data", (event) => {
  //         props.acceptTransactionSuccess(event.transactionHash);
  //       })
  //       .on("error", console.error);

  //     props.transactionContract.events
  //       .Payment()
  //       .on("data", (event) => {
  //         props.paymentSuccess(event.transactionHash);
  //       })
  //       .on("error", console.error);

  //     props.transactionContract.events
  //       .TransactionSuccess()
  //       .on("data", (event) => {
  //         props.confirmTransactionSuccess(event.transactionHash);
  //       })
  //       .on("error", console.error);

  //     props.transactionContract.events
  //       .TransactionCanceled()
  //       .on("data", (event) => {
  //         props.cancelTransactionSuccess(event.transactionHash);
  //       })
  //       .on("error", console.error);
  //   }
  // }, [props.transactionContract]);

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <div className="container mt-85 mb-100">
      <h3>Qu?? tr??nh giao d???ch t??i s???n</h3>
      <ExpansionPanel
        square
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <ExpansionPanelSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
        >
          <Typography style={{ color: "green" }}>
            Th??ng tin giao d???ch {""}
            <i className="far fa-check-circle" style={{ color: "green" }}></i>
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {expanded === "panel1" && <Info match={props.match} />}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <ExpansionPanelSummary
          aria-controls="panel2d-content"
          id="panel2d-header"
        >
          <Typography>Ch???p nh???n giao d???ch (K?? h???p ?????ng ?????t c???c)</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {expanded === "panel2" &&
            (party == PARTY_CONSTANT.SELLER ? (
              <SellerAcceptTransaction />
            ) : party == PARTY_CONSTANT.BUYER ? (
              <BuyerAcceptTransaction />
            ) : (
              <DepositContract />
            ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <ExpansionPanelSummary
          aria-controls="panel3d-content"
          id="panel3d-header"
        >
          <Typography>Chuy???n ti???n c??n l???i</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {expanded === "panel3" &&
            (party == PARTY_CONSTANT.SELLER ? (
              <SellerPayment />
            ) : party == PARTY_CONSTANT.BUYER ? (
              <BuyerPayment />
            ) : (
              <DepositContract />
            ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <ExpansionPanelSummary
          aria-controls="panel4d-content"
          id="panel4d-header"
        >
          <Typography>K?? h???p ?????ng chuy???n nh?????ng</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {expanded === "panel4" &&
            (party == PARTY_CONSTANT.SELLER ? (
              <SellerConfirmTransaction />
            ) : party == PARTY_CONSTANT.BUYER ? (
              <BuyerConfirmTransaction />
            ) : (
              <DepositContract />
            ))}
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {/* <ExpansionPanel
        square
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <ExpansionPanelSummary
          aria-controls="panel5d-content"
          id="panel5d-header"
        >
          <Typography>????ng h???p ?????ng chuy???n nh?????ng</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <DepositConfirm />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <ExpansionPanelSummary
          aria-controls="panel6d-content"
          id="panel6d-header"
        >
          <Typography>K?? khai thu???</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <PaymentConfirm />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <ExpansionPanelSummary
          aria-controls="panel7d-content"
          id="panel7d-header"
        >
          <Typography>????ng thu??? nh?? n?????c</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <PayTaxes />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel
        square
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <ExpansionPanelSummary
          aria-controls="panel8d-content"
          id="panel8d-header"
        >
          <Typography>X??c nh???n ????ng thu???</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <TaxesConfirm />
        </ExpansionPanelDetails>
      </ExpansionPanel> */}
      <ExpansionPanel
        disabled
        square
        expanded={expanded === "panel9"}
        onChange={handleChange("panel9")}
      >
        <ExpansionPanelSummary
          aria-controls="panel9d-content"
          id="panel9d-header"
        >
          <Typography>K???t th??c</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Finished />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <div style={{ color: "red", fontWeight: "bold" }}>
        {props.transaction.state}
      </div>
      <h3>{party}</h3>
      {/* Dissable buttons for outsiders transactions */}
      {party != PARTY_CONSTANT.OUT_TRANSACTION && (
        <button
          className="btn v3 float-right mt-5 "
          onClick={() =>
            props.cancelTransaction(props.transaction, props.user.publicAddress)
          } // get sender
        >
          <i className="ion-android-cancel"></i> H???y b??? giao d???ch
        </button>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
    user: state.user.data,
    transactionContract: state.shared.transaction,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchTransaction: (idTransaction) => {
      dispatch(fetchTransactionRequest(idTransaction));
    },
    cancelTransaction: (transaction, publicAddress) => {
      dispatch(cancelTransactionRequest(transaction, publicAddress));
    },
    acceptTransactionSuccess: (txHash) => {
      dispatch(acceptTransactionSuccess(txHash));
    },
    paymentTransactionSuccess: (txHash) => {
      dispatch(paymentTransactionSuccess(txHash));
    },
    confirmTransactionSuccess: (txHash) => {
      dispatch(confirmTransactionSuccess(txHash));
    },
    cancelTransactionSuccess: (txHash) => {
      dispatch(cancelTransactionSuccess(txHash));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomizedExpansionPanels);
