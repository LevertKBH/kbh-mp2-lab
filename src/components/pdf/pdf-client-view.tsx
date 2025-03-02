"use client";

import { type PrismaModels } from "@/types/db-models";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import logo from "../../../public/other.jpg";

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
export const DowntimeReport = ({ data }: { data: DowntimeReportData }) => {
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
          <Image src={logo.src} style={{ height: 50, width: 50 }} />
          {/* Try rendering the image */}
          {/* <Image
              src={{
                uri: "/favicon.png",
              }}
              style={{ height: 50, width: 50 }}
            /> */}
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
