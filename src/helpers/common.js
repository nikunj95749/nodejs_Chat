export const REGULAR = 'Regular';
export const OVER_TIME = 'Over time';
export const DOUBLE_TIME = 'Double time';


export let HTMLData = `<html>
<head>
    <style>
        h3{
            font-family: arial, sans-serif;   
        }
        table {
            font-family: arial, sans-serif;
            /* border-collapse: collapse; */
            width: 100%;
        }
        
        td,
        th {
            /* border: 1px solid #dddddd; */
            text-align: left;
            padding: 8px;
        }

        .section{
            text-align: center;
            background-color:orange;
            padding-top: 4px;
            padding-bottom: 4px;
        }

        /* tr:nth-child(even) {
       background-color: #dddddd; 
    } */
    </style>
</head>

<body>

    <div class=WordSection1 style="width: 1100px;">
        <table>
            <thead>
                <th style="width:700px;">
                    <img alt="" src="data:image/heic;base64,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"
                    />
                </th>
               
                <th style="width:400px;">
                    <span style="font-weight:bold;font-size:large;">INSPECTION REPORT </span><br>
                    <span style="font-weight:normal;color: orange;"> #WO.TaskName#</span>
                </th>
            </thead>
        </table>
        <hr>
        <table>
            <tbody>
                <tr>
                    <td style="text-align:right;vertical-align: top;"><b>CLIENT :</b></td>
                    <td>#WO.ClientName# <br> 
                        #WO.ClientAddress1# <br> 
                        #WO.ClientAddress2#
                    </td>
                    <td style="text-align:right;"><b>REVIEWED DATE :</b></td>
                    <td>#WO.DispatchDate#</td>
                </tr>
                <tr>
                    <td style="text-align:right;"><b>ATTENTION :</b></td>
                    <td>SCOTT MCCREARY</td>
                    <td style="text-align:right;"><b>PROJECT :</b></td>
                    <td>#WO.ProjectName#</td>
                </tr>
                <tr>
                    <td style="text-align:right"><b>TITLE :</b></td>
                    <td>QUALITY CONTROL MANAGER</td>
                    <td style="text-align:right"><b>ADDRESS :</b></td>
                    <td>5400 W 99TH PL, <br> LOS ANGELES, CA
                    </td>
                </tr>
                <tr>
                    <td style="text-align:right"></td>
                    <td></td>
                    <td style="text-align:right"><b>INSPECTOR :</b></td>
                    <td>RAYMOND MARTINEZ
                    </td>
                </tr>
                <tr>
                    <td style="text-align:right"><b>CC:</b></td>
                    <td>SCOTT MCCREARY(SMCCREARY@THEQUALITYFIRM.COM)</td>
                    <td style="text-align:right"><b>PROJECT# :</b></td>
                    <td>20-0037</td>
                </tr>
                <tr>
                    <td style="text-align:right"></td>
                    <td></td>
                    <td style="text-align:right"><b>REPORT# :</b></td>
                    <td>082
                    </td>
                </tr>
            </tbody>
        </table>
        <h3 class="section">FIELD DATA</h3>
        <table style="width:1100px;">
            <tbody>
                <tr>
                    <td><b>LOCATION :</b> #Field.Location#</td>
                    <td><b>ACTIVITY/MATERIAL:</b> #Field.ActivityMaterial#</td>
                </tr>
                <tr>
                    <td><b>CONTRACTOR(PRIME/SUB):</b> #Field.Contractor#</td>
                    <td><b>THCHNICAL SPEC:</b> #Field.TechnicalSpec#</td>
                </tr>
            </tbody>
        </table>
        <h3 class="section">SUMMARY OF WORK PERFORM</h3>
        <table>
            <tbody>
                <tr>
                    
                    <td colspan="4" style="height:250px;vertical-align: top;">
                        #Field.Summary#
                    </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:1100px;">
            <tbody>
                <tr>
                    <td style="text-align:right;">Sample Type:SKANSKA</td>
                    <!-- <td>SKANSKA</td> -->
                    <td style="text-align:right">Quantity:</td>
                    <td></td>
                </tr>
            </tbody>
        </table>
        <hr>

        <table style="width:290px;">
            <tbody>
                <tr>
                    <td style="text-align:right">Corrective/Remedial Actions Taken:</td>
                    <!-- <td></td> -->
                    <!-- <td style="text-align:right">ACTIVITY/MATERIAL:</td>
                    <td>:2701-UGL-LEAD UTILITY LOCATION</td> -->
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:1100px;">
            <tbody>
                <tr>
                    <td>Conforms with Plans and Technical Specifications:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                    <!-- <td>Testing Performed ?</td>
                    <td>#Radio.TestPerform#</td> -->
                </tr>
                <tr>
                    <td>Testing Performed:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                    <td>Owner Represantetion:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                    <!-- <td>Testing Performed ?</td>
                    <td>#Radio.TestPerform#</td> -->
                </tr>
            </tbody>
        </table>
        <h3 class="section"><b>COMPLIANCE WITH TERMS OF THE CONTRACT </b></h3>
        <table style="width:1100px;">
            <tbody>
                <tr>
                    <td>All Supplies And Materials used In The Work Are In Compliance:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:1100px;">
            <tbody>
                <tr>
                    <td>Work Performed In A Safe Manner:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                    <td>Onsite Equipment And Utilization:</td>
                    <td>
                        <div>
                            <input type="radio" id="age1" name="age" value="YES" checked>
                            <label for="age1">YES</label>
                            <input type="radio" id="age2" name="age" value="NO">
                            <label for="age2">NO</label>
                            <input type="radio" id="age3" name="age" value="N/A">
                            <label for="age3">N/A</label>
                        </div>
                    </td>
                    <!-- <td>Testing Performed ?</td>
                    <td>#Radio.TestPerform#</td> -->
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:500px;">
            <tbody>
                <tr>
                    <td style="text-align:right;">Conversations/Instructions Given From The Owner (Include Name):</td>
                    <!-- <td> </td>
                    <td style="text-align:right"></td>
                    <td></td> -->
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:90px;">
            <tbody>
                <tr>
                    <td style="text-align:right;">Remarks:</td>
                    <!-- <td> </td>
                    <td style="text-align:right"></td>
                    <td></td> -->
                </tr>
            </tbody>
        </table>
        <hr>
        <table style="width:200px;">
            <tbody>
                <tr>
                    <td style="text-align:right;">Report Copied To:</td>
                    <!-- <td> </td>
                    <td style="text-align:right"></td>
                    <td></td> -->
                </tr>
            </tbody>
        </table>
        <hr>
        <table>
            <tbody>
                <tr>
                    <td style="text-align:left; width: 50%;">
                        Start Time: <span style="padding:5px;"></span>
                        End Time:<span style="padding:5px;"></span>
                    </td>
                 
                    <td style="width: 50%;text-align:right;">
                        ST:<span style="padding:5px;"></span> 
                        OT:<span style="padding:5px;"></span>
                        DT:<span style="padding:5px;"></span>
                        NS:<span style="padding:5px;"></span>
                        NSOT:<span style="padding:5px;"></span>
                        NSDT:<span style="padding:5px;"></span>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="width:1500px;">
                    <td >Inspector Signature<br> 
                    <hr style="height:2px;width:200px;margin-left:0;margin-left:0;border-width:0;color:gray;background-color:black""/>
                    <img width="200px" height="100px" src="#Sign.InspectionSign#" />
                   </td>
                    <td >Client Signature<br> <hr style="height:2px;width:200px;margin-left:0;margin-left:0;border-width:0;color:gray;background-color:black""/> <img width="200px" height="100px" src="#Sign.ClientSign#" /></td>
        </table>
    </div>

</body>

</html>`