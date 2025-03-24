import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchAction, setSearchAction] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/audit-logs");
      setLogs(response.data);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const filteredLogs = logs.filter((log) => {
    return (
      (!selectedDate || log.created_at.startsWith(selectedDate)) &&
      (!searchUser || log.username.toLowerCase().includes(searchUser.toLowerCase())) &&
      (!searchAction || log.action.toLowerCase().includes(searchAction.toLowerCase()))
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Audit Log</h2>

      {/* Filters */}
      <div className="mb-4 flex gap-4">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by user"
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Search by action"
          value={searchAction}
          onChange={(e) => setSearchAction(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Details</th>
              <th className="p-2">Date</th>
              <th className="p-2">IP Address</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.username || "System"}</td>
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.details || "N/A"}</td>
                  <td className="p-2">{new Date(log.created_at).toLocaleString()}</td>
                  <td className="p-2">{log.ip_address || "Unknown"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
