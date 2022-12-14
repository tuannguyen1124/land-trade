import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import "./contract.css";
import formatCurrency from "../../../utils/formatCurrency";
import numberToString from "../../../utils/numberToString";
import axios from "axios";
import Loading from "../../../components/Loading/loading";
import Cookie from "../../../helper/cookie";
import { convertWeiToVND } from "../../../utils/convertCurrency";

const DepositContract = (props) => {
  const [loading, setLoading] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const area =
    props.property.properties.landLot.commonUseArea +
    props.property.properties.landLot.privateUseArea;
  const propertyAddress = props.property.properties.landLot.address;
  const depositPrice = Math.floor(
    convertWeiToVND(props.transaction.depositPrice)
  );
  const transferPrice = Math.floor(
    convertWeiToVND(props.transaction.transferPrice)
  );
  const previewContract = async () => {
    setLoading(true);
    // get all value of input and name
    const allInputTag = Array.from(document.querySelectorAll("input"));
    const dataRender = allInputTag.reduce((acc, item) => {
      acc[item.name] = item.value;
      return acc;
    }, {});
    const payload = {
      ...dataRender,
      buyers,
      sellers,
      area,
      propertyAddress,
    };

    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL_API}/pdf/down-payment`,
      data: payload,
    });
    setLoading(false);
    window.open(
      `${process.env.REACT_APP_BASE_URL_ASSETS}/${response.data.url}`
    );
  };

  // get all user infor from publicAddress
  const getUserProfile = async (publicAddress) => {
    const response = await axios({
      method: "GET",
      url: `${process.env.REACT_APP_BASE_URL_API}/users/${publicAddress}`,
      headers: {
        Authorization: `Bearer ${Cookie.getCookie("accessToken")}`,
      },
    });
    return response.data.data;
  };

  const getParticipantsInfo = async (buyers, sellers) => {
    const promises1 = buyers.map((publicAddress) =>
      getUserProfile(publicAddress)
    );
    const promises2 = sellers.map((publicAddress) =>
      getUserProfile(publicAddress)
    );
    return await Promise.all([Promise.all(promises1), Promise.all(promises2)]);
  };

  // get participants information
  useEffect(() => {
    (async () => {
      const [buyersInfo, sellersInfo] = await getParticipantsInfo(
        props.transaction.buyers,
        props.transaction.sellers
      );
      setBuyers(buyersInfo);
      setSellers(sellersInfo);
    })();
  }, []);

  return (
    <div className="page-wrapper">
      {loading && <Loading isLoading={loading} />}
      <table
        align="center"
        border={0}
        cellSpacing="true"
        cellPadding="true"
        width="100%"
        style={{ margin: "75px auto" }}
      >
        {/* Qu???c hi???u */}
        <tbody>
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td>
                      <h6 className="text-center mb-0">
                        C???NG H??A X?? H???I CH??? NGH?? VI???T NAM
                      </h6>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="text-center">
                        <b>?????c l???p - T??? do - H???nh Ph??c</b>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center">---------------------------</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* T??n h???p ?????ng */}
          <tr>
            <td>
              <table
                border={0}
                cellSpacing="true"
                cellPadding="true"
                width="100%"
              >
                <tbody>
                  <tr>
                    <td>
                      <h3 className="text-center mb-0 mt-10">
                        H???P ?????NG ?????T C???C
                      </h3>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="font-italic text-center mb-10">
                        (V/v Mua b??n nh??, ?????t)
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* th??ng tin th???i gian */}
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td>
                      <div className="mb-20">
                        H??m nay, ng??y{" "}
                        <input
                          type="date"
                          name="dateContract"
                          defaultValue={new Date().toISOString().split("T")[0]}
                        />{" "}
                        . T???i
                        <input type="text" name="addressContract" />, Ch??ng t??i
                        g???m c??:
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* b??n A */}
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td>
                      <div className="font-weight-bold mb-20">
                        I. B??n ?????t c???c(Sau ????y g???i l?? b??n A):
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          {buyers.map((buyer, index) => {
                            return (
                              <Fragment key={index}>
                                <tr>
                                  <td>
                                    ??ng (B??):{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      name={"buyer[" + index + "].fullname"}
                                      defaultValue={buyer.fullName}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Sinh ng??y:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // name={"buyer[" + index + "].birthday"}
                                      defaultValue={buyer.birthday}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Ch???ng minh nh??n d??n s???{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"buyer[" + index + "].idNumber"}
                                      defaultValue={buyer.idNumber}
                                    />
                                  </td>

                                  <td>
                                    C???p ng??y:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"buyer[" + index + "].issuedDate"}
                                      defaultValue={buyer.issueDate}
                                    />
                                  </td>

                                  <td>
                                    N??i c???p{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"buyer[" + index + "].issuedBy"}
                                      defaultValue={buyer.issuedBy}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    H??? Kh???u th?????ng tr??:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"buyer[" + index + "].address"}
                                      defaultValue={buyer.address}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* b??n B */}
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td>
                      <div className="font-weight-bold mb-20 mt-20">
                        II. B??n nh???n ?????t c???c(Sau ????y g???i l?? b??n B):
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          {sellers.map((seller, index) => {
                            return (
                              <Fragment key={index}>
                                <tr>
                                  <td>
                                    ??ng (B??):{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // name={"seller[" + index + "].fullname"}
                                      defaultValue={seller.fullName}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Sinh ng??y:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // name={"seller[" + index + "].birthday"}
                                      defaultValue={seller.birthday}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    Ch???ng minh nh??n d??n s???:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"seller[" + index + "].idNumber"}
                                      defaultValue={seller.idNumber}
                                    />
                                  </td>
                                  <td>
                                    C???p ng??y:{" "}
                                    <input
                                      type="date"
                                      disabled={true}
                                      // className=""
                                      // name={"seller[" + index + "].issueDate"}
                                      defaultValue={seller.issueDate}
                                    />
                                  </td>
                                  <td>
                                    N??i c???p{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"seller[" + index + "].issueBy"}
                                      defaultValue={seller.issuedBy}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    H??? Kh???u th?????ng tr??:{" "}
                                    <input
                                      type="text"
                                      disabled={true}
                                      // className=""
                                      // name={"seller[" + index + "].address"}
                                      defaultValue={seller.address}
                                    />
                                  </td>
                                </tr>
                              </Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <div className="font-weight-bold mb-20 mt-20">
                        C??c th??nh vi??n c???a h??? gia ????nh b??n B:
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              ??ng b??:{" "}
                              <input type="text" name="seller[1].fullname" />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Sinh ng??y:{" "}
                              <input type="text" name="seller[1].birthday" />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Ch???ng minh nh??n d??n s???:{" "}
                              <input
                                type="text"
                                className=""
                                name="seller[1].idNumber"
                              />
                            </td>

                            <td>
                              C???p ng??y:{" "}
                              <input
                                type="text"
                                className=""
                                name="seller[1].dateIdNumber"
                              />
                            </td>
                            <td>
                              N??i c???p:{" "}
                              <input
                                type="text"
                                className=""
                                name="seller[1].placeIdNumber"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              H??? Kh???u th?????ng tr??:{" "}
                              <input
                                type="text"
                                className=""
                                name="seller[1].address"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr> */}
                </tbody>
              </table>
            </td>
          </tr>
          {/* Ng?????i l??m ch???ng */}
          <tr>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div className="font-weight-bold mb-20 mt-20">
                        III. C??ng l??m ch???ng:
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              ??ng b??:{" "}
                              <input
                                type="text"
                                disabled={true}
                                name="notary[0].fullname"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Sinh ng??y:{" "}
                              <input
                                type="text"
                                disabled={true}
                                name="notary[0].birthday"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Ch???ng minh nh??n d??n s???:{" "}
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="notary[0].idNumber"
                              />
                            </td>

                            <td>
                              C???p ng??y:{" "}
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="notary[0].dateIdNumber"
                              />
                            </td>

                            <td>
                              N??i c???p:{" "}
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="notary[0].placeIdNumber"
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              H??? Kh???u th?????ng tr??:{" "}
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="notary[0].address"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* ??i???u kho???n */}
          <tr>
            <td>
              <table>
                <tbody>
                  <tr>
                    <td>
                      <div className="font-weight-bold mb-20 mt-20">
                        IV. Hai b??n ?????ng ?? th???c hi???n k?? k???t H???p ?????ng ?????t c???c v???i
                        c??c th???a thu???n sau ????y:
                      </div>
                    </td>
                  </tr>
                  {/* ??i???u 1: t??i s???n ?????t c???c */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20">
                                ??I???U 1:T??I S???N ?????T C???C
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              B??n A ?????t c???c cho b??n B b???ng ti???n m???t v???i s??? ti???n
                              l??
                            </td>
                            <td>
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="depositPrice"
                                defaultValue={formatCurrency(
                                  depositPrice.toString()
                                )}
                              />
                              {"VN??"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              B???ng ch???:{" "}
                              <input
                                disabled={true}
                                type="text"
                                name="downPaymentInWord"
                                defaultValue={numberToString(depositPrice)}
                              />
                              {" ?????ng."}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 2 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 2: TH???I H???N ?????T C???C
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>Th???i h???n ?????t c???c l??</td>
                            <td>
                              <input
                                type="text"
                                className=""
                                name="depositPeriod"
                                defaultValue={60}
                              />
                              {" ng??y"}
                            </td>
                          </tr>
                          <tr>
                            <td>T??nh t??? ng??y</td>
                            <td>
                              <input
                                type="date"
                                className=""
                                name="startDeposit"
                                defaultValue={
                                  new Date().toISOString().split("T")[0]
                                }
                              />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 3 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 3: M???C ????CH ?????T C???C
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. B???ng vi???c ?????t c???c n??y B??n A cam k???t mua ?????t c???a
                              b??n B t???i{" "}
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="propertyAddress"
                                defaultValue={propertyAddress}
                              />{" "}
                              B??n B nh???n ti???n ?????t c???c v?? cam k???t s??? b??n ?????t
                              thu???c s??? h???u h???p ph??p v?? kh??ng c?? b???t k??? tranh
                              ch???p n??o li??n quan ?????n m???nh ?????t m?? b??n B giao b??n
                              cho b??n A t???i :
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="propertyAddress"
                                defaultValue={propertyAddress}
                              />
                              . v???i di???n t??ch l??
                              <input
                                type="text"
                                disabled={true}
                                defaultValue={area}
                              />{" "}
                              .m2 gi?? b??n l??
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="transferPrice"
                                defaultValue={formatCurrency(
                                  transferPrice.toString()
                                )}
                              />
                              {" VN??"}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              2. Trong th???i gian ?????t c???c, b??n B cam k???t s??? l??m
                              c??c th??? t???c ph??p l?? ????? chuy???n nh?????ng quy???n s??? d???ng
                              ?????t cho b??n A, b??n A cam k???t s??? tr???
                              <input
                                type="text"
                                disabled={true}
                                className=""
                                name="remainingAmount"
                                defaultValue={formatCurrency(
                                  (
                                    props.transaction.transferPrice -
                                    props.transaction.downPayment
                                  ).toString()
                                )}
                              />
                              khi hai b??n k?? h???p ?????ng mua b??n ?????t t???i ph??ng c??ng
                              ch???ng Nh?? N?????c s??? ???????c b??n A thanh to??n n???t khi
                              b??n B giao gi???y ch???ng nh???n quy???n s??? d???ng ?????t. B??n
                              B cam k???t s??? giao gi???y ch???ng nh???n quy???n s??? d???ng
                              ?????t trong v??ng 7 ng??y k??? t??? ng??y b??n A v?? b??n B k??
                              h???p ?????ng mua b??n t???i ph??ng c??ng ch???ng Nh?? N?????c.
                              B??n B c?? ngh??a v??? n???p c??c kho???n thu??? ph??t sinh
                              trong qu?? tr??nh giao d???ch theo ????ng quy ?????nh c???a
                              ph??p lu???t (?????i v???i thu??? ?????t, thu??? chuy???n nh?????ng
                              b??n B s??? l?? ng?????i thanh to??n m?? b??n A kh??ng ph???i
                              tr??? b???t c??? kho???n ph?? n??o) .
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 4 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 4: NGH??A V??? V?? QUY???N C???A B??N A
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>1. B??n A c?? c??c ngh??a v??? sau ????y:</td>
                          </tr>
                          <tr>
                            <td>
                              a) Giao s??? ti???n ?????t c???c cho B??n B theo ????ng th???a
                              thu???n ngay khi k?? h???p ?????ng ?????t c???c;
                            </td>
                          </tr>
                          <tr>
                            <td>
                              b) Giao k???t ho???c th???c hi???n ngh??a v??? d??n s??? ???? th???a
                              thu???n t???i ??i???u 3 n??u tr??n. N???u B??n A t??? ch???i giao
                              k???t ho???c th???c hi???n ngh??a v??? d??n s??? (m???c ????ch ?????t
                              c???c kh??ng ?????t ???????c) th?? B??n A b??? m???t s??? ti???n ?????t
                              c???c;
                            </td>
                          </tr>
                          <tr>
                            <td>2. B??n A c?? c??c quy???n sau ????y:</td>
                          </tr>
                          <tr>
                            <td>
                              a) Nh???n l???i s??? ti???n ?????t c???c t??? B??n B ho???c ???????c tr???
                              khi th???c hi???n ngh??a v??? tr??? ti???n cho B??n B trong
                              tr?????ng h???p 2 B??n giao k???t ho???c th???c hi???n ngh??a v???
                              d??n s??? ???? th???a thu???n t???i ??i???u 3(m???c ????ch ?????t c???c
                              ?????t ???????c);
                            </td>
                          </tr>
                          <tr>
                            <td>
                              b) Nh???n l???i s??? ti???n ?????t c???c v?? m???t kho???n ti???n b???ng
                              s??? ti???n ?????t c???c trong tr?????ng h???p B??n B t??? ch???i
                              vi???c giao k???t ho???c th???c hi???n ngh??a v??? d??n s??? ????
                              th???a thu???n t???i ??i???u 3(m???c ????ch ?????t c???c kh??ng ?????t
                              ???????c);
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 5 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 5: NGH??A V??? V?? QUY???N C???A B??N B
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>1. B??n B c?? c??c ngh??a v??? sau ????y:</td>
                          </tr>
                          <tr>
                            <td>
                              a) Tr??? l???i s??? ti???n ?????t c???c cho B??n A ho???c tr??? ?????
                              th???c hi???n ngh??a v??? tr??? ti???n trong tr?????ng h???p 2 B??n
                              giao k???t ho???c th???c hi???n ngh??a v??? d??n s??? ???? th???a
                              thu???n t???i ??i???u 3 (m???c ????ch ?????t c???c ?????t ???????c);
                            </td>
                          </tr>
                          <tr>
                            <td>
                              b) Tr??? l???i s??? ti???n ?????t c???c v?? m???t kho???n ti???n b???ng
                              s??? ti???n ?????t c???c cho B??n A trong tr?????ng h???p B??n B
                              t??? ch???i vi???c giao k???t ho???c th???c hi???n ngh??a v??? d??n
                              s??? ???? th???a thu???n t???i ??i???u 3(m???c ????ch ?????t c???c kh??ng
                              ?????t ???????c);
                            </td>
                          </tr>
                          <tr>
                            <td>
                              c) B??n B c?? ngh??a v??? d???n d???p s???ch s??? m???t b???ng khi
                              giao ?????t ????? tr??? l???i m???t b???ng ?????t th??? c?? cho b??n A.
                            </td>
                          </tr>
                          <tr>
                            <td>2. B??n B c?? c??c quy???n sau ????y:</td>
                          </tr>
                          <tr>
                            <td>
                              S??? h???u s??? ti???n ?????t c???c n???u B??n A t??? ch???i giao k???t
                              ho???c th???c hi???n ngh??a v??? d??n s??? ???? th???a thu???n t???i
                              ??i???u 3(m???c ????ch ?????t c???c kh??ng ?????t ???????c).
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 6 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 6: PH????NG TH???C GI???I QUY???T TRANH CH???P
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Trong qu?? tr??nh th???c hi???n H???p ?????ng m?? ph??t sinh
                              tranh ch???p, c??c b??n c??ng nhau th????ng l?????ng gi???i
                              quy???t tr??n nguy??n t???c t??n tr???ng quy???n l???i c???a
                              nhau; n???u m???nh ?????t tr??n thu???c di???n quy ho???ch kh??ng
                              giao d???ch ???????c th?? b??n B ph???i ho??n tr??? l???i 100% s???
                              ti???n m?? b??n A ???? giao cho b??n B . Trong tr?????ng h???p
                              kh??ng gi???i quy???t ???????c, th?? m???t trong hai b??n c??
                              quy???n kh???i ki???n ????? y??u c???u to?? ??n c?? th???m quy???n
                              gi???i quy???t theo quy ?????nh c???a ph??p lu???t. M???i tranh
                              ch???p s??? ???????c ph??n x??? theo quy ?????nh c???a lu???t ph??p
                              c???a Vi???t Nam.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 7 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 7: CAM ??OAN C???A C??C B??N
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              B??n A v?? b??n B ch???u tr??ch nhi???m tr?????c ph??p lu???t v???
                              nh???ng l???i cam ??oan sau ????y:
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. Vi???c giao k???t H???p ?????ng n??y ho??n to??n t??? nguy???n,
                              kh??ng b??? l???a d???i ho???c ??p bu???c.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              2. Th???c hi???n ????ng v?? ?????y ????? t???t c??? c??c tho??? thu???n
                              ???? ghi trong H???p ?????ng n??y.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              3. B??n B ???? nh???n ????? s??? ti???n ?????t c???c n??u trong ??i???u
                              1 t??? b??n A
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                  {/* ??i???u 8 */}
                  <tr>
                    <td>
                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <div className="font-weight-bold mb-20 mt-20">
                                ??I???U 8: ??I???U KHO???N CU???I C??NG
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. Hai b??n c??ng nh???n ???? hi???u r?? quy???n, ngh??a v??? v??
                              l???i ??ch h???p ph??p c???a m??nh, ?? ngh??a v?? h???u qu??? ph??p
                              l?? c???a vi???c giao k???t H???p ?????ng n??y.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              2. Hai b??n ???? t??? ?????c H???p ?????ng, ???? hi???u v?? ?????ng ??
                              t???t c??? c??c ??i???u kho???n ghi trong H???p ?????ng v?? k?? v??o
                              H???p ?????ng n??y tr?????c s??? c?? m???t c???a ng?????i l??m ch???ng.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              3. H???p ?????ng c?? hi???u l???c t???{"    "}
                              <input
                                type="date"
                                name="timeContractValid"
                                defaultValue={
                                  new Date().toISOString().split("T")[0]
                                }
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              H???p ?????ng ?????t C???c bao g???m 03 trang ???????c chia l??m
                              b???n b???n c?? gi?? tr??? ph??p l?? nh?? nhau, m???i b??n gi???
                              hai b???n.
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* ng??y */}
          <tr>
            <td>
              <table
                width="100%"
                cellSpacing="true"
                cellPadding="true"
                className="mt-20 mb-20"
              >
                <tbody>
                  <tr>
                    <td style={{ width: "50%", textAlign: "center" }}></td>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <input type="text" className="" name="signAddress" />,
                      ng??y
                      <input
                        type="date"
                        className=""
                        name="signDate"
                        defaultValue={new Date().toISOString().split("T")[0]}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          {/* ch??? k?? */}
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <table border={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="text-center">B??n A</td>
                          </tr>
                          <tr>
                            <td className="text-center">(K??, ghi r?? h??? t??n)</td>
                          </tr>
                          <tr>
                            <td height={90} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <table border={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="text-center">B??n B</td>
                          </tr>
                          <tr>
                            <td className="text-center">(K??, ghi r?? h??? t??n)</td>
                          </tr>
                          <tr>
                            <td height={90} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <table border={0} width="100%">
                <tbody>
                  <tr>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <table border={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="text-center">Ng?????i l??m ch???ng</td>
                          </tr>
                          <tr>
                            <td className="text-center">(K??, ghi r?? h??? t??n)</td>
                          </tr>
                          <tr>
                            <td height={90} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td style={{ width: "50%", textAlign: "center" }}>
                      <table border={0} width="100%">
                        <tbody>
                          <tr>
                            <td className="text-center">Ng?????i l??m ch???ng</td>
                          </tr>
                          <tr>
                            <td className="text-center">(K??, ghi r?? h??? t??n)</td>
                          </tr>
                          <tr>
                            <td height={90} />
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="btn v4 ml-2" onClick={() => previewContract()}>
        <i className="ion-android-add-circle"></i> Xem tr?????c
      </button>
      <button
        className="btn v4 ml-2"
        onClick={() =>
          getParticipantsInfo(props.transaction.buyer, props.transaction.seller)
        }
      >
        <i className="ion-android-add-circle"></i> T???o h???p ?????ng
      </button>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    transaction: state.transaction.data,
    property: state.transaction.property,
  };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(DepositContract);
