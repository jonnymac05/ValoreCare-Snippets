import React from "react";
import {
  Page,
  Text,
  View,
  StyleSheet,
  Document,
  Image,
} from "@react-pdf/renderer";
import logger from "sabio-debug";
import { PdfTitle } from "../pdf/examplePdf/miscComponents/PdfTitle";
import PropTypes from "prop-types";
import { timeConverter as ConvertTime } from "../utilities/ConvertTime";

const _logger = logger.extend("providerdetailPDF");

const styles = StyleSheet.create({
  page: {
    padding: 10,
  },

  certImage: {
    height: 150,
    width: 150,
    marginBottom: 5,
  },

  bulletPoint: {
    width: 10,
    fontSize: 10,
  },

  container: {
    flex: 1,
  },

  section: {
    margin: 4,
    padding: 4,
  },

  image: {
    marginBottom: 10,
  },

  leftColumn: {
    flexDirection: "column",
    width: 300,
    paddingTop: 15,
    paddingRight: 15,
  },

  rightColumn: {
    textAlign: "center",
    flexDirection: "column",
    width: 300,
    paddingTop: 15,
    paddingRight: 15,
    "@media max-width: 400": {
      width: "100%",
      paddingRight: 0,
    },
    "@media orientation: portrait": {
      width: 200,
    },
  },

  footer: {
    fontSize: 12,
    fontFamily: "Lato Bold",
    textAlign: "center",
    marginTop: 25,
    paddingTop: 10,
    borderWidth: 3,
    borderColor: "gray",
    borderStyle: "dashed",
    "@media orientation: landscape": {
      marginTop: 10,
    },
  },

  sectionHeading: {
    margin: 1,
    padding: 1,
  },

  textCenter: {
    textAlign: "left",
    fontSize: 12,
    marginBottom: 1,
    padding: 1,
  },

  text: {
    margin: 2,
    fontSize: 14,
    textAlign: "left",
    fontFamily: "Times-Roman",
  },
  textRight: {
    textAlign: "right",
    margin: 2,
    fontSize: 14,
    fontFamily: "Times-Roman",
  },
});

const ProviderDetailPdf = props => {
  const provider = props.pdfData;
  const daysOfWeek = props.daysOfWeek;
  const certificateTypes = props.certificateTypes;
  const providerEducation = props.providerEducation;
  const providerSchedule = props.providerAvailability;

  const expDet = provider.experienceDetails;
  const certs = provider.certifications;
  const lic = provider.licenses;

  const filterDay = id => {
    let day = daysOfWeek.filter(day => day.id === id);
    return day[0].name;
  };

  const filterEducation = id => {
    let ed = certificateTypes.filter(ed => ed.id === id);
    return ed[0].name;
  };

  //#region types mapping

  const languages =
    provider.languages &&
    provider.languages.map(lang => <Text key={lang.id}>{lang.name}, </Text>);

  const careNeeds =
    provider.careNeeds &&
    provider.careNeeds.map(care => <Text key={care.id}>{care.name}, </Text>);

  const helpTypes =
    provider.helperNeeds &&
    provider.helperNeeds.map(help => <Text key={help.id}>{help.name}, </Text>);

  const concernTypes =
    provider.concerns &&
    provider.concerns.map(concern => (
      <Text key={concern.id}>{concern.name}, </Text>
    ));

  const expertiseTypes =
    provider.expertise &&
    provider.expertise.map(exp => <Text key={exp.id}>{exp.name}, </Text>);

  //#endregion

  _logger("ProviderPDF", props);
  return (
    <Document>
      <Page wrap size="A4" style={styles.page}>
        <PdfTitle title={`${provider.firstName} ${provider.lastName}`} />
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>About</Text>
            <Text style={styles.text}> Title: {provider.title} </Text>
            <Text style={styles.text}> Summary: {provider.summary} </Text>
            <Text style={styles.text}> Bio: {provider.bio} </Text>
            <Text style={styles.text}> Price: ${provider.price} </Text>
          </View>
          <View style={styles.section}>
            <Text>Experience</Text>
            {expDet &&
              expDet.length > 0 &&
              expDet.map((exp, index) => (
                <span key={index}>
                  <Text style={styles.text}>
                    Job Title: {expDet[index].jobTitle}
                  </Text>
                  <Text style={styles.text}>
                    Company: {expDet[index].companyName}
                  </Text>
                  <Text style={styles.text}>
                    Description: {expDet[index].description}
                  </Text>
                  <Text style={styles.text}>
                    Start Date:{" "}
                    {new Date(expDet[index].startDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.text}>
                    End Date:{" "}
                    {new Date(expDet[index].endDate).toLocaleDateString()}
                  </Text>
                  <Text style={styles.text}>
                    {expDet[index].city}, {expDet[index].state}
                  </Text>
                  <Text style={styles.text}>{expDet[index].country}</Text>
                </span>
              ))}
          </View>
          <View style={styles.section}>
            <Text>Schedule Availability</Text>
            {providerSchedule &&
              providerSchedule.length > 0 &&
              providerSchedule.map((pSch, index) => (
                <span key={index}>
                  <Text style={styles.text}>
                    Day Of Week: {filterDay(providerSchedule[index].dayOfWeek)}
                  </Text>
                  <Text style={styles.text}>
                    Start Time: {ConvertTime(providerSchedule[index].startTime)}{" "}
                    - End Time: {ConvertTime(providerSchedule[index].endTime)}
                  </Text>
                </span>
              ))}
          </View>
          <View style={styles.section}>
            <Text>Education</Text>
            {providerEducation &&
              providerEducation.length > 0 &&
              providerEducation.map((pEd, index) => (
                <span key={index}>
                  <Text style={styles.text}>
                    Certificate:{" "}
                    {filterEducation(
                      providerEducation[index].certificateTypeId,
                    )}
                  </Text>
                  <Text style={styles.text}>
                    Major: {providerEducation[index].major}
                  </Text>
                  <Text style={styles.text}>
                    Institute: {providerEducation[index].instituteName}
                  </Text>
                  <Text style={styles.text}>
                    Start Date:{" "}
                    {new Date(
                      providerEducation[index].startDate,
                    ).toLocaleDateString()}
                  </Text>
                  <Text style={styles.text}>
                    End Date:{" "}
                    {new Date(
                      providerEducation[index].endDate,
                    ).toLocaleDateString()}
                  </Text>
                </span>
              ))}
          </View>
          <View style={styles.section}>
            <Text break>Certifications</Text>
            {certs &&
              certs.length > 0 &&
              certs.map((cert, index) => (
                <span key={index}>
                  <Text style={styles.text}>
                    Certification Type: {certs[index].certificationType}
                  </Text>
                  <Text style={styles.text}>
                    Certification:{" "}
                    <Image
                      style={styles.certImage}
                      src={certs[index].certificationUrl}
                    ></Image>
                  </Text>
                </span>
              ))}
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Licenses</Text>
            {lic &&
              lic.length > 0 &&
              lic.map((license, index) => (
                <span key={index}>
                  <Text style={styles.text}>License: {lic[index].name}</Text>
                  <Text style={styles.text}>
                    License:{" "}
                    <Image
                      style={styles.certImage}
                      src={lic[index].licenseUrl}
                    ></Image>
                  </Text>
                </span>
              ))}
          </View>
          <View style={styles.leftColumn}>
            <View style={styles.section}>
              <Text>Languages</Text>
              <Text style={styles.text}>{languages}</Text>
            </View>
            <View style={styles.section}>
              <Text>Experienced and Specializes In</Text>
              <Text style={styles.text}>
                {careNeeds} {concernTypes}
                {expertiseTypes}
              </Text>
            </View>
            <View style={styles.section}>
              <Text>Other Details</Text>
              <Text style={styles.text}>{helpTypes}</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

ProviderDetailPdf.propTypes = {
  pdfData: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    title: PropTypes.string,
    summary: PropTypes.string,
    bio: PropTypes.string,
    price: PropTypes.number,
    experienceDetails: PropTypes.arrayOf(
      PropTypes.shape({
        jobTitle: PropTypes.string,
        companyName: PropTypes.string,
        description: PropTypes.string,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        city: PropTypes.string,
        state: PropTypes.string,
        country: PropTypes.string,
      }),
    ),
    certifications: PropTypes.arrayOf(
      PropTypes.shape({
        certificationType: PropTypes.string,
        certificationUrl: PropTypes.string,
      }),
    ),
    licenses: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        licenseUrl: PropTypes.string,
      }),
    ),
    languages: PropTypes.arrayOf(PropTypes.shape({})),
    careNeeds: PropTypes.arrayOf(PropTypes.shape({})),
    helperNeeds: PropTypes.arrayOf(PropTypes.shape({})),
    concerns: PropTypes.arrayOf(PropTypes.shape({})),
    expertise: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  providerEducation: PropTypes.arrayOf(
    PropTypes.shape({
      certificateTypeId: PropTypes.number,
      major: PropTypes.string,
      instituteName: PropTypes.string,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
    }),
  ),
  providerAvailability: PropTypes.arrayOf(
    PropTypes.shape({
      dayOfWeek: PropTypes.number,
      startTime: PropTypes.string,
      endTime: PropTypes.string,
    }),
  ),
  daysOfWeek: PropTypes.arrayOf(PropTypes.shape({})),
  certificateTypes: PropTypes.arrayOf(PropTypes.shape({})),
  filter: PropTypes.func,
};

export default ProviderDetailPdf;
