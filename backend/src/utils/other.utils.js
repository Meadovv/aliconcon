const _ = require('lodash');

const { BAD_REQUEST_ERROR } = require('../core/error.response');

class OtherUtils {
    static getInfoData = ({ fields, object }) => {
        return _.pick(object, fields);
    }

    static getFields = ({ fields, object }) => {
        const pickedObject = _.pick(object, fields);
        const extraFields = _.difference(_.keys(object), fields);
        const missingFields = _.difference(fields, _.keys(object));

        if (extraFields.length > 0 || missingFields.length > 0) {
            let errorMessage = 'Object contains extra fields or missing fields!';

            if (extraFields.length > 0) {
                errorMessage += ` Extra fields: ${extraFields.join(', ')}.`;
            }

            if (missingFields.length > 0) {
                errorMessage += ` Missing fields: ${missingFields.join(', ')}.`;
            }

            throw new BAD_REQUEST_ERROR(errorMessage);
        }

        return pickedObject;
    }

    static generateVerificationHTMLContent = ({ email, name, key }) => {
        return `
        <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="table-layout: fixed; background-color: #f9f9f9"
            id="bodyTable"
        >
            <tbody>
                <tr>
                    <td style="padding-right: 10px; padding-left: 10px" align="center" valign="top" id="bodyCell">
                        <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            width="100%"
                            class="wrapperBody"
                            style="max-width: 600px"
                        >
                            <tbody>
                                <tr>
                                    <td align="center" valign="top">
                                        <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            width="100%"
                                            class="tableCard"
                                            style="
                                                background-color: #fff;
                                                border-color: #e5e5e5;
                                                border-style: solid;
                                                border-width: 0 1px 1px 1px;
                                            "
                                        >
                                            <tbody>
                                                <tr>
                                                    <td
                                                        style="
                                                            background-color: #00d2f4;
                                                            font-size: 1px;
                                                            line-height: 3px;
                                                        "
                                                        class="topBorder"
                                                        height="3"
                                                    >
                                                        &nbsp;
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="
                                                            padding-bottom: 5px;
                                                            padding-left: 20px;
                                                            padding-right: 20px;
                                                        "
                                                        align="center"
                                                        valign="top"
                                                        class="mainTitle"
                                                    >
                                                        <h2
                                                            class="text"
                                                            style="
                                                                color: #000;
                                                                font-family: Poppins, Helvetica, Arial, sans-serif;
                                                                font-size: 28px;
                                                                font-weight: 500;
                                                                font-style: normal;
                                                                letter-spacing: normal;
                                                                line-height: 36px;
                                                                text-transform: none;
                                                                text-align: center;
                                                                padding: 0;
                                                                margin: 0;
                                                            "
                                                        >
                                                            Email Verification
                                                        </h2>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style="padding-left: 20px; padding-right: 20px"
                                                        align="center"
                                                        valign="top"
                                                        class="containtTable ui-sortable"
                                                    >
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            width="100%"
                                                            class="tableDescription"
                                                            style=""
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style="padding-bottom: 20px"
                                                                        align="center"
                                                                        valign="top"
                                                                        class="description"
                                                                    >
                                                                        <p
                                                                            class="text"
                                                                            style="
                                                                                color: #666;
                                                                                font-family: 'Open Sans', Helvetica,
                                                                                    Arial, sans-serif;
                                                                                font-size: 14px;
                                                                                font-weight: 400;
                                                                                font-style: normal;
                                                                                letter-spacing: normal;
                                                                                line-height: 22px;
                                                                                text-transform: none;
                                                                                text-align: center;
                                                                                padding: 0;
                                                                                margin: 0;
                                                                            "
                                                                        >
                                                                                <h2>Dear ${name},</h2>
                                                                                <p>We received a request to reset your password for your Aliconcon E-commerce account. If you did not make this request, please ignore this email.</p>
                                                                                <p>Otherwise, please click on the button below to reset your password:</p>
                                                                                <p>Link below will expire in 5 minute, so be sure to use it right away.</p>
                                                                                <p>Thank you for using Aliconcon E-commerce!</p>
                                                                                <p>Best regards,</p>
                                                                                <p>The Aliconcon Team</p>
                                                                        </p>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <table
                                                            border="0"
                                                            cellpadding="0"
                                                            cellspacing="0"
                                                            width="100%"
                                                            class="tableButton"
                                                            style=""
                                                        >
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style="padding-top: 20px; padding-bottom: 20px"
                                                                        align="center"
                                                                        valign="top"
                                                                    >
                                                                        <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            align="center"
                                                                        >
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td
                                                                                        style="
                                                                                            background-color: rgb(
                                                                                                0,
                                                                                                210,
                                                                                                244
                                                                                            );
                                                                                            padding: 12px 35px;
                                                                                            border-radius: 50px;
                                                                                        "
                                                                                        align="center"
                                                                                        class="ctaButton"
                                                                                    >
                                                                                        <a
                                                                                            href="https://api.aliconcon.xyz/v1/access/password-reset?key=${key}&email=${email}"
                                                                                            style="
                                                                                                color: #fff;
                                                                                                font-family: Poppins,
                                                                                                    Helvetica, Arial,
                                                                                                    sans-serif;
                                                                                                font-size: 13px;
                                                                                                font-weight: 600;
                                                                                                font-style: normal;
                                                                                                letter-spacing: 1px;
                                                                                                line-height: 20px;
                                                                                                text-transform: uppercase;
                                                                                                text-decoration: none;
                                                                                                display: block;
                                                                                            "
                                                                                            target="_blank"
                                                                                            class="text"
                                                                                            >Confirm Email</a
                                                                                        >
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
                                                <tr>
                                                    <td style="font-size: 1px; line-height: 1px" height="20">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="space">
                                            <tbody>
                                                <tr>
                                                    <td style="font-size: 1px; line-height: 1px" height="30">&nbsp;</td>
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
        </table>`
    }
}

module.exports = OtherUtils;