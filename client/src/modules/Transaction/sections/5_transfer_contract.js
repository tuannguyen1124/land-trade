import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import Loading from "../../../components/Loading/loading";
import axios from "axios";
import Cookie from "../../../helper/cookie";
import numberToString from "../../../utils/numberToString";
import formatCurrency from "../../../utils/formatCurrency";

const TransferContract = (props) => {
  const [loading, setLoading] = useState(false);
  const [buyers, setBuyers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const currentDate = new Date();
  const { landLot, house } = props.property.properties;

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
      propertyDetail: props.property.properties,
      transaction: props.transaction,
    };

    const response = await axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL_API}/pdf/transfer-contract`,
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
    const promises1 = buyers.map((buyer) =>
      getUserProfile(buyer.publicAddress)
    );
    const promises2 = sellers.map((seller) =>
      getUserProfile(seller.publicAddress)
    );
    return await Promise.all([Promise.all(promises1), Promise.all(promises2)]);
  };

  // fetch all infor of participants
  useEffect(() => {
    (async () => {
      const [buyersInfo, sellersInfo] = await getParticipantsInfo(
        props.transaction.buyer,
        props.transaction.seller
      );
      setBuyers(buyersInfo);
      setSellers(sellersInfo);
    })();
  }, []);

  return (
    <div className="page-wrapper container">
      {loading && <Loading isLoading={loading} />}
      <table border={0} cellSpacing={1} cellPadding={0}>
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
              <table border={0} cellSpacing={0} cellPadding={0} width="100%">
                <tbody>
                  <tr>
                    <td>
                      <h4 className="text-center mb-0 mt-10">
                        H???P ?????NG CHUY???N NH?????NG QUY???N S??? D???NG ?????T QUY???N S??? H???U
                        NH?? ???
                      </h4>
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
                          type="text"
                          defaultValue={currentDate.getDate()}
                        />{" "}
                        th??ng
                        <input
                          type="text"
                          defaultValue={currentDate.getMonth()}
                        />{" "}
                        n??m{" "}
                        <input
                          type="text"
                          defaultValue={currentDate.getFullYear()}
                        />
                        . T???i
                        <input type="text" />, Ch??ng t??i g???m c??:
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
                        I. B??n chuy???n nh?????ng(Sau ????y g???i l?? b??n A):
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
                                  <td>??ng (B??):</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.fullName}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Sinh ng??y:</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.birthday}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Ch???ng minh nh??n d??n s???</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.idNumber}
                                      className=""
                                    />
                                  </td>
                                  <td>C???p ng??y</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.issueDate}
                                      className=""
                                    />
                                  </td>
                                  <td>N??i c???p</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.issuedBy}
                                      className=""
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>H??? Kh???u th?????ng tr??</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={seller.address}
                                      className=""
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
                          C??c th??nh vi??n c???a h??? gia ????nh b??n A:
                        </div>
                      </td>
                    </tr> */}
                  {/* <tr>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td>??ng b??:</td>
                              <td>
                                <input type="text" defaultValue={""} />
                              </td>
                            </tr>
                            <tr>
                              <td>Sinh ng??y:</td>
                              <td>
                                <input type="text" defaultValue={""} />
                              </td>
                            </tr>
                            <tr>
                              <td>Ch???ng minh nh??n d??n s???</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                              <td>C???p ng??y</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                              <td>N??i c???p</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                            </tr>
                            <tr>
                              <td>H??? Kh???u th?????ng tr??</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>*/}
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
                        II. B??n nh???n chuy???n nh?????ng(Sau ????y g???i l?? b??n B):
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
                                  <td>??ng (B??):</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.fullName}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Sinh ng??y:</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.birthday}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>Ch???ng minh nh??n d??n s???</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.idNumber}
                                      className=""
                                    />
                                  </td>
                                  <td>C???p ng??y</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.issueDate}
                                      className=""
                                    />
                                  </td>
                                  <td>N??i c???p</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.issuedBy}
                                      className=""
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td>H??? Kh???u th?????ng tr??</td>
                                  <td>
                                    <input
                                      type="text"
                                      disabled={true}
                                      defaultValue={buyer.address}
                                      className=""
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
                    </tr> */}
                  {/* <tr>
                      <td>
                        <table>
                          <tbody>
                            <tr>
                              <td>??ng (B??):</td>
                              <td>
                                <input type="text" defaultValue={""} />
                              </td>
                            </tr>
                            <tr>
                              <td>Sinh ng??y:</td>
                              <td>
                                <input type="text" defaultValue={""} />
                              </td>
                            </tr>
                            <tr>
                              <td>Ch???ng minh nh??n d??n s???</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                              <td>C???p ng??y</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                              <td>N??i c???p</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
                              </td>
                            </tr>
                            <tr>
                              <td>H??? Kh???u th?????ng tr??</td>
                              <td>
                                <input type="text" defaultValue={""} className="" />
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
                            <td>??ng (B??):</td>
                            <td>
                              <input type="text" defaultValue={""} />
                            </td>
                          </tr>
                          <tr>
                            <td>Sinh ng??y:</td>
                            <td>
                              <input type="text" defaultValue={""} />
                            </td>
                          </tr>
                          <tr>
                            <td>Ch???ng minh nh??n d??n s???</td>
                            <td>
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />
                            </td>
                            <td>C???p ng??y</td>
                            <td>
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />
                            </td>
                            <td>N??i c???p</td>
                            <td>
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>H??? Kh???u th?????ng tr??</td>
                            <td>
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
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
                      <div className="font-italic mb-20 mt-20 text-center">
                        Hai B??n t??? nguy???n c??ng nhau l???p v?? k?? H???p ?????ng n??y ?????
                        th???c hi???n vi???c chuy???n nh?????ng quy???n s??? d???ng ?????t, quy???n s???
                        h???u nh?? ??? theo c??c tho??? thu???n sau ????y:
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
                                ??I???U 1:QUY???N S??? D???NG ?????T, QUY???N S??? H???U NH?? ???
                                CHUY???N NH?????NG
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. Hi???n B??n A ??ang c?? quy???n s??? d???ng ?????t, quy???n s???
                              h???u nh?? ??? t???i ?????a ch???:{" "}
                              <input
                                type="text"
                                disabled={true}
                                defaultValue={landLot.address}
                                className=""
                              />{" "}
                              theo s???
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />{" "}
                              do{" "}
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />{" "}
                              c???p ng??y{" "}
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td className="font-italic">
                              Th??ng tin c??? th??? nh?? sau:
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <table>
                                <tbody>
                                  <tr>
                                    <td>Th???a ????t</td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Th???a ?????t s???:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.landLotNo}
                                        className=""
                                      />
                                    </td>
                                    <td>
                                      T??? b???n ????? s???:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.mapSheetNo}
                                        className=""
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      ?????a ch???:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.address}
                                        className=""
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Di???n t??ch:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={
                                          landLot.commonUseArea +
                                          landLot.privateUseArea
                                        }
                                        className=""
                                      />
                                      {" m"}
                                      <sup>2</sup>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      M???c ????ch s??? d???ng:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.purposeOfUse}
                                        className=""
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Th???i h???n s??? d???ng:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.timeOfUse}
                                        className=""
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      Ngu???n g???c s??? d???ng:{" "}
                                      <input
                                        type="text"
                                        disabled={true}
                                        defaultValue={landLot.originOfUse}
                                        className=""
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          {house && (
                            <tr>
                              <td>
                                <table>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <b>Nh?? ???</b>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        ?????a ch???:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={house.address}
                                          className=""
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Di???n t??ch x??y d???ng:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={house.constructionArea}
                                          className=""
                                        />
                                        {" m"} <sup>2</sup>
                                      </td>
                                      <td>
                                        Di???n t??ch s??n:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={house.floorArea}
                                          className=""
                                        />
                                        {" m"}
                                        <sup>2</sup>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        K???t c???u:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={"...."}
                                          className=""
                                        />
                                      </td>
                                      <td>
                                        C???p h???ng nh?? ???:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={house.level}
                                          className=""
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        S??? t???ng:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={house.numberOfFloor}
                                          className=""
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        Ghi ch??:{" "}
                                        <input
                                          type="text"
                                          disabled={true}
                                          defaultValue={"...."}
                                          className=""
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                          <tr>
                            <td>
                              2. B???ng H???p ?????ng n??y B??n A ?????ng ?? chuy???n nh?????ng
                              to??n b??? quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? n??i
                              tr??n cho B??n B v?? B??n B ?????ng ?? nh???n chuy???n nh?????ng
                              to??n b??? quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? n??i
                              tr??n nh?? hi???n tr???ng.
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
                                ??I???U 2: GI?? CHUY???N NH?????NG V?? PH????NG TH???C THANH
                                TO??N
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. Gi?? chuy???n nh?????ng quy???n s??? d???ng ?????t, quy???n s???
                              h???u nh?? ??? n??u t???i ??i???u 1 c???a H???p ?????ng n??y l??:{" "}
                              <input
                                type="text"
                                defaultValue={formatCurrency(
                                  props.transaction.transferPrice.toString()
                                )}
                                className=""
                              />{" "}
                              VN?? (B???ng ch???:{" "}
                              <input
                                type="text"
                                defaultValue={numberToString(
                                  props.transaction.transferPrice
                                )}
                                className=""
                              />
                              {" ?????ng."}
                              ).
                            </td>
                          </tr>
                          <tr>
                            <td>
                              2. Ph????ng th???c thanh to??n: (2){" "}
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Vi???c thanh to??n s??? ti???n n??u t???i kho???n 1 ??i???u n??y
                              do hai b??n t??? th???c hi???n v?? t??? ch???u tr??ch nhi???m
                              tr?????c ph??p lu???t.
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
                                ??I???U 3: VI???C GIAO V?? ????NG K?? QUY???N S??? D???NG ?????T
                                QUY???N S??? H???U NH?? ???
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              1. B??n A c?? ngh??a v??? giao quy???n s??? d???ng ?????t, quy???n
                              s??? h???u nh?? ??? n??u t???i ??i???u 1 c???a H???p ?????ng n??y c??ng
                              c??c gi???y t??? v??? quy???n s??? d???ng ?????t, quy???n s??? h???u nh??
                              ??? cho b??n B tr?????c khi k?? H???p ?????ng.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              2. B??n B c?? ngh??a v??? th???c hi???n ????ng k?? quy???n s???
                              d???ng ?????t, quy???n s??? h???u nh?? ??? t???i c?? quan c?? th???m
                              quy???n theo quy ?????nh c???a ph??p lu???t.
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
                                ??I???U 4: TR??CH NHI???M N???P THU???, L??? PH??
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Thu???, l??? ph?? li??n quan ?????n vi???c chuy???n nh?????ng
                              quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? theo H???p
                              ?????ng n??y do
                              <input
                                type="text"
                                defaultValue={""}
                                className=""
                              />{" "}
                              ch???u tr??ch nhi???m ????ng.
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
                                ??I???U 5: PH????NG TH???C GI???I QUY???T TRANH CH???P H???P
                                ?????NG
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Trong qu?? tr??nh th???c hi???n H???p ?????ng n??y, n???u ph??t
                              sinh tranh ch???p, c??c b??n c??ng nhau th????ng l?????ng
                              gi???i quy???t tr??n nguy??n t???c t??n tr???ng quy???n l???i c???a
                              nhau; Trong tr?????ng h???p kh??ng gi???i quy???t ???????c th??
                              m???t trong hai b??n c?? quy???n kh???i ki???n ????? y??u c???u
                              to?? ??n c?? th???m quy???n gi???i quy???t theo quy ?????nh c???a
                              ph??p lu???t.
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
                                ??I???U 6: CAM ??OAN C???A C??C B??N
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Hai b??n ch???u tr??ch nhi???m tr?????c ph??p lu???t v??? nh???ng
                              l???i cam ??oan sau ????y:
                            </td>
                          </tr>
                          <tr>
                            <td>1. B??n A cam ??oan:</td>
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li>
                                  Nh???ng th??ng tin v??? nh??n th??n, v??? quan h??? h??n
                                  nh??n v?? v??? quy???n s??? d???ng ?????t, quy???n s??? h???u nh??
                                  ??? ???? n??u trong h???p ?????ng n??y l?? ????ng s??? th???t;
                                </li>
                                <li>
                                  Quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? n??i tr??n
                                  ch??a tham gia b???t c??? m???t giao d???ch n??o: Kh??ng
                                  t???ng cho, h???a b??n, cho thu??, cho m?????n, c???m c???,
                                  ?????t c???c, th??? ch???p, g??p v???n;
                                </li>
                                <li>
                                  Quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? kh??ng c??
                                  tranh ch???p, ???????c ph??p chuy???n nh?????ng theo quy
                                  ?????nh c???a ph??p lu???t;
                                </li>
                                <li>
                                  Quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? kh??ng b???
                                  k?? bi??n ????? b???o ?????m thi h??nh ??n;
                                </li>
                                <li>
                                  Quy???n s??? d???ng ?????t, quy???n s??? h???u nh?? ??? kh??ng b???
                                  quy ho???ch ho???c thu???c tr?????ng h???p b??? gi???i ph??ng
                                  m???t b???ng.
                                </li>
                                <li>
                                  C?? tr??ch nhi???m t???o m???i ??i???u ki???n cho B??n B
                                  ho??n t???t c??c th??? t???c c?? li??n quan ?????n vi???c
                                  ????ng k?? sang t??n quy???n s??? d???ng ?????t, quy???n s???
                                  h???u nh?? ??? t???i c?? quan Nh?? n?????c c?? th???m quy???n.
                                </li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td>2. B??n B cam ??oan:</td>
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li>
                                  Nh???ng th??ng tin v??? nh??n th??n, v??? quan h??? h??n
                                  nh??n m?? B??n B cung c???p ghi trong h???p ?????ng l??
                                  ????ng s??? th???t;
                                </li>
                                <li>
                                  B??n B t??? ch???u tr??ch nhi???m v??? vi???c t??m hi???u
                                  th??ng tin, ?????ng th???i ???? xem x??t r???t k???, bi???t
                                  r?? v??? th???a ?????t v?? nh?? ??? n??u t???i ??i???u 1 c???a H???p
                                  ?????ng n??y c??ng c??c gi???y t??? v??? quy???n s??? d???ng ?????t
                                  v?? quy???n s??? h???u nh?? ??? n??u tr??n;
                                </li>
                              </ul>
                            </td>
                          </tr>
                          <tr>
                            <td>3. Hai b??n cam ??oan:</td>
                          </tr>
                          <tr>
                            <td>
                              <ul>
                                <li>
                                  ?????m b???o t??nh ch??nh x??c, trung th???c v?? ho??n
                                  to??n ch???u tr??ch nhi???m tr?????c ph??p lu???t n???u c??
                                  s??? gi??? m???o v??? h??? s??, gi???y t??? cung c???p c??ng nh??
                                  c??c h??nh vi gian l???n hay vi ph???m ph??p lu???t
                                  kh??c li??n quan t???i vi???c k?? k???t h???p ?????ng n??y;
                                </li>
                                <li>
                                  Vi???c giao k???t H???p ?????ng n??y ho??n to??n t???
                                  nguy???n, kh??ng b??? l???a d???i, kh??ng bi?? ??p bu???c;
                                </li>
                                <li>
                                  Th???c hi???n ????ng v?? ?????y ????? c??c tho??? thu???n ???? ghi
                                  trong H???p ?????ng n??y;
                                </li>
                              </ul>
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
                                ??I???U 7: ??I???U KHO???N CU???I C??NG
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              B???n H???p ?????ng n??y c?? hi???u l???c ngay sau khi hai B??n
                              k?? k???t. Vi???c s???a ?????i, b??? sung ho???c hu??? b??? H???p ?????ng
                              n??y ch??? c?? gi?? tr??? khi ???????c hai B??n l???p th??nh v??n
                              b???n v?? ch??? ???????c th???c hi???n khi B??n B ch??a ????ng k??
                              sang t??n quy???n s??? d???ng ?????t v?? quy???n s??? h???u nh?? ???
                              theo H???p ?????ng n??y.
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Hai b??n ???? t??? ?????c nguy??n v??n, ?????y ????? c??c trang c???a
                              b???n H???p ?????ng n??y v?? kh??ng y??u c???u ch???nh s???a, th??m,
                              b???t b???t c??? th??ng tin g?? trong b???n h???p ?????ng n??y.
                              ?????ng th???i hi???u r?? quy???n, ngh??a v???, l???i ??ch h???p
                              ph??p c???a m??nh v?? h???u qu??? ph??p l?? c???a vi???c giao k???t
                              H???p ?????ng n??y.
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
                            <td className="text-center">
                              B??n chuy???n nh?????ng (B??n A)
                            </td>
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
                            <td className="text-center">
                              {" "}
                              B??n nh???n chuy???n nh?????ng (B??n B)
                            </td>
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
        // onClick={() =>
        //   getParticipantsInfo(props.transaction.buyer, props.transaction.seller)
        // }
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TransferContract);
