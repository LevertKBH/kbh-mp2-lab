"use client";

import { type PrismaModels } from "@/types/db-models";
import {
  Document,
  G,
  Image,
  Page,
  Path,
  PDFViewer,
  StyleSheet,
  Svg,
  type SVGProps,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Define a constant for the logo path - this needs to be an absolute URL
const LOGO_PATH =
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg";

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  section: {
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "1px solid #EEEEEE",
    paddingBottom: 8,
  },
  logo: {
    width: 50,
    height: 50,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#EEEEEE",
    borderRadius: 4,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 10,
    color: "#666666",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    backgroundColor: "#F5F5F5",
    padding: 4,
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  label: {
    width: 140,
    fontWeight: "bold",
    fontSize: 10,
  },
  value: {
    flex: 1,
    fontSize: 10,
  },
  auditLog: {
    marginBottom: 8,
    padding: 4,
    borderBottom: "1px solid #EEEEEE",
  },
  auditLogHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  auditLogText: {
    fontSize: 9,
  },
  auditLogTitle: {
    fontSize: 9,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 8,
    color: "#666666",
    borderTop: "1px solid #EEEEEE",
    paddingTop: 8,
  },
});

type DowntimeReportData = {
  user: PrismaModels["User"];
  downtime: PrismaModels["Downtime"];
  auditLogs: PrismaModels["AuditLog"][];
};

// Create the PDF report component
const DowntimeReport = ({ data }: { data: DowntimeReportData }) => {
  const { user, downtime, auditLogs } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Downtime Report</Text>
            <Text style={styles.subtitle}>
              Generated on: {format(new Date(), "PPP")}
            </Text>
          </View>
          {/* Try rendering the image */}
          <Image src={LOGO_PATH} style={styles.logo} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{user.role ?? "User"}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Downtime Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Start Date:</Text>
            <Text style={styles.value}>{downtime.start_date}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>End Date:</Text>
            <Text style={styles.value}>
              {downtime.end_date ?? "Not resolved yet"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plant Category:</Text>
            <Text style={styles.value}>{downtime.plant_category}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plant Section:</Text>
            <Text style={styles.value}>{downtime.plant_section}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Discipline:</Text>
            <Text style={styles.value}>{downtime.discipline}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Plant Equipment:</Text>
            <Text style={styles.value}>{downtime.plant_equipment}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Breakdown Description:</Text>
            <Text style={styles.value}>{downtime.breakdown_description}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>
              {downtime.notes ?? "No notes provided"}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Created By:</Text>
            <Text style={styles.value}>
              {user.name} ({user.email})
            </Text>
          </View>
          {downtime.created_at && (
            <View style={styles.row}>
              <Text style={styles.label}>Created At:</Text>
              <Text style={styles.value}>
                {format(new Date(downtime.created_at), "PPP p")}
              </Text>
            </View>
          )}
          {downtime.updated_at && (
            <View style={styles.row}>
              <Text style={styles.label}>Last Updated:</Text>
              <Text style={styles.value}>
                {format(new Date(downtime.updated_at), "PPP p")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Audit Logs</Text>
          {auditLogs.length === 0 ? (
            <Text style={styles.auditLogText}>No audit logs available</Text>
          ) : (
            auditLogs.map((log, index: number) => (
              <View key={index} style={styles.auditLog}>
                <View style={styles.auditLogHeader}>
                  <Text style={styles.auditLogTitle}>
                    {log.action.toUpperCase()}
                  </Text>
                  <Text style={styles.auditLogText}>
                    {format(new Date(log.created_at), "PPP p")}
                  </Text>
                </View>
                <Text style={styles.auditLogText}>{log.description}</Text>
                <Text style={styles.auditLogText}>
                  By: {log.performed_by_name ?? "Unknown"} (
                  {log.performed_by_identifier ?? "Unknown"})
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.footer}>
          <Text>
            This is an automatically generated report. ©{" "}
            {new Date().getFullYear()} MP2
          </Text>
        </View>
      </Page>
    </Document>
  );
};

const Logo = (props: SVGProps) => (
  <Svg
    width={props.width ?? "400"}
    height={props.height ?? "174"}
    viewBox="0 0 400 174"
    {...props}
  >
    <G>
      <Path
        d="M319.391 16.635C319.104 16.668 318.126 16.781 317.217 16.886C312.164 17.468 305.564 18.806 302.696 19.83C301.93 20.103 300.856 20.454 300.309 20.609C294.257 22.326 290.528 25.222 290.085 28.547C289.357 34.021 292.337 37.227 296.309 35.241C296.952 34.92 297.791 34.556 298.174 34.433C298.557 34.31 299.261 33.995 299.739 33.734C300.217 33.472 301 33.118 301.478 32.947C301.957 32.776 302.433 32.572 302.537 32.494C302.642 32.415 303.595 32.043 304.657 31.666C305.718 31.289 306.729 30.905 306.902 30.813C307.076 30.721 308.077 30.432 309.128 30.169C310.179 29.907 311.459 29.548 311.971 29.371C316.306 27.88 327.127 28.04 331.217 29.657C336.473 31.734 339.22 34.144 341.144 38.367C342.932 42.288 341.706 50.243 338.635 54.655C338.354 55.06 337.83 55.861 337.471 56.435C335.429 59.704 330.065 65.623 325.555 69.584C322.588 72.19 319.684 74.616 318.565 75.426C318.041 75.805 317.33 76.366 316.281 77.229C315.808 77.619 315.215 78.072 312.428 80.174C312.11 80.413 311.405 80.961 310.861 81.391C310.316 81.822 309.461 82.487 308.961 82.87C308.462 83.252 307.6 83.917 307.048 84.348C306.495 84.778 305.671 85.404 305.217 85.739C304.763 86.074 303.971 86.674 303.457 87.072C302.943 87.471 302.052 88.161 301.478 88.605C300.904 89.05 300.012 89.741 299.495 90.141C298.978 90.542 298.231 91.104 297.835 91.391C297.439 91.678 296.502 92.383 295.752 92.957C295.003 93.53 294.134 94.196 293.822 94.435C290.43 97.032 288.938 98.724 288.29 100.709C286.834 105.171 288.164 108.759 291.607 109.656C292.867 109.984 361.214 110.05 362.508 109.724C366.088 108.823 367.115 102.602 364.142 99.828C362.898 98.669 364.303 98.729 337.971 98.711L313.942 98.696L313.493 98.274C312.362 97.213 313.336 95.589 316.161 93.826C316.621 93.539 317.348 93.03 317.778 92.696C318.208 92.361 319.559 91.304 320.78 90.348C322.002 89.391 323.262 88.413 323.581 88.174C323.9 87.935 325.066 87.035 326.172 86.174C327.279 85.313 328.646 84.257 329.211 83.826C336.847 78.012 346.029 69.779 349.772 65.391C350.221 64.865 351.177 63.751 351.895 62.916C352.614 62.08 353.29 61.234 353.396 61.034C353.503 60.835 354.118 59.915 354.763 58.988C355.408 58.062 356.19 56.796 356.501 56.174C356.812 55.552 357.253 54.691 357.482 54.261C359.3 50.839 360.713 42.676 360.2 38.554C359.842 35.67 358.161 30.892 356.998 29.452C356.777 29.18 356.394 28.643 356.146 28.261C354.888 26.323 351.178 23.167 348.68 21.911C348.258 21.698 347.795 21.422 347.652 21.296C347.508 21.17 346.767 20.818 346.004 20.512C345.242 20.207 344.46 19.854 344.266 19.728C343.947 19.521 342.084 18.962 338.696 18.057C334.537 16.946 323.618 16.142 319.391 16.635"
        fill="#2d5682"
      />
      <Path
        d="M0 86.609L0 173.217L199.443 173.217C354.334 173.217 398.934 173.171 399.096 173.009C399.257 172.847 399.304 153.368 399.304 86.4L399.304 0L199.652 0L0 0L0 86.609"
        fill="#fafafb"
      />
      <Path
        d="M320.609 14.959C319.843 15.024 317.662 15.207 315.76 15.365C311.53 15.717 310.504 15.875 308.951 16.418C308.285 16.65 306.862 17.006 305.789 17.208C304.716 17.411 303.347 17.761 302.745 17.987C302.144 18.213 301.183 18.556 300.609 18.75C297.566 19.773 294.375 21.22 292.356 22.491C286.778 26.005 286.524 34.351 291.913 37.043C293.568 37.87 297.055 37.25 298.888 35.803C298.995 35.719 299.521 35.499 300.058 35.314C300.596 35.129 301.526 34.707 302.126 34.376C302.726 34.045 303.648 33.685 304.174 33.577C304.7 33.469 305.606 33.152 306.188 32.873C306.77 32.594 307.709 32.245 308.275 32.098C319.157 29.269 324.366 29.156 331.631 31.592C333.211 32.122 333.68 32.354 334.753 33.138C337.358 35.043 338.346 36.164 339.039 38.005C339.266 38.609 339.571 39.285 339.716 39.508C340.411 40.575 340.324 45.149 339.564 47.478C339.33 48.196 338.989 49.414 338.807 50.187C338.487 51.539 338.265 51.984 336.249 55.304C335.543 56.468 334.534 57.894 333.81 58.753C333.514 59.104 333.201 59.522 333.114 59.683C332.341 61.112 327.263 66.082 321.217 71.327C320.411 72.026 316.934 74.801 316.46 75.123C316.255 75.263 315.798 75.615 315.445 75.906C315.093 76.197 314.398 76.748 313.901 77.13C313.404 77.513 312.675 78.11 312.281 78.456C311.888 78.803 311.245 79.311 310.853 79.587C310.462 79.862 309.687 80.439 309.13 80.87C308.574 81.3 307.799 81.878 307.408 82.153C307.016 82.429 306.657 82.708 306.609 82.774C306.561 82.839 306.052 83.24 305.478 83.664C304.904 84.088 304.357 84.524 304.261 84.633C304.165 84.742 303.774 85.038 303.391 85.289C303.009 85.541 302.304 86.063 301.826 86.449C301.348 86.836 300.174 87.728 299.217 88.431C298.261 89.135 297.243 89.912 296.957 90.158C296.67 90.404 296.122 90.84 295.739 91.126C292.046 93.887 291.292 94.496 289.301 96.328C284.171 101.046 284.639 108.154 290.259 110.854L291.739 111.565L327.133 111.565L362.528 111.565L363.881 110.87C365.973 109.795 366.758 108.755 367.228 106.436C368.051 102.374 366.878 99.303 363.918 97.765L362.696 97.13L339.354 97.043C312.871 96.945 314.72 97.058 316.262 95.628C316.712 95.211 317.522 94.573 318.062 94.211C319.239 93.422 320.107 92.803 320.696 92.334C320.935 92.144 321.418 91.775 321.769 91.516C323.53 90.213 324.451 89.499 324.609 89.315C324.704 89.203 325.148 88.863 325.594 88.558C326.039 88.253 326.431 87.937 326.463 87.854C326.495 87.772 326.835 87.497 327.217 87.243C327.6 86.99 328.383 86.393 328.957 85.916C329.53 85.439 330.352 84.799 330.783 84.495C331.213 84.19 331.855 83.7 332.21 83.405C332.564 83.111 333.298 82.517 333.839 82.087C334.38 81.657 335.007 81.135 335.231 80.927C335.456 80.72 335.786 80.446 335.966 80.319C336.146 80.191 336.751 79.696 337.31 79.217C337.868 78.739 338.722 78.012 339.206 77.601C339.691 77.19 340.439 76.547 340.87 76.171C341.3 75.795 341.926 75.257 342.261 74.975C342.596 74.693 343.235 74.123 343.682 73.709C344.129 73.295 344.676 72.795 344.899 72.598C345.122 72.4 345.422 72.111 345.565 71.954C345.709 71.798 346.398 71.099 347.098 70.4C350.343 67.16 354.989 61.797 355.655 60.522C355.781 60.283 355.983 60.009 356.106 59.913C356.229 59.817 356.619 59.23 356.973 58.609C358.883 55.255 359.388 54.258 359.824 52.975C360.088 52.2 360.503 51.096 360.747 50.522C362.542 46.298 362.469 36.118 360.621 32.961C360.396 32.576 360.017 31.783 359.78 31.2C359.384 30.223 358.354 28.603 357.029 26.87C355.77 25.225 352.693 22.566 350.174 20.945C349.251 20.352 345.878 18.609 345.652 18.609C345.605 18.609 345.077 18.379 344.479 18.098C343.881 17.817 342.576 17.382 341.58 17.131C340.584 16.88 339.55 16.562 339.283 16.424C338.382 15.958 336.568 15.652 333.101 15.383C331.204 15.235 328.948 15.046 328.087 14.961C326.303 14.786 322.664 14.785 320.609 14.959"
        fill="#7e7a8f"
      />
    </G>
  </Svg>
);

// Export the client-side PDF viewer component
export default function PDFClientView({ data }: { data: DowntimeReportData }) {
  return (
    <div className="h-screen w-full">
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <DowntimeReport data={data} />
      </PDFViewer>
    </div>
  );
}
