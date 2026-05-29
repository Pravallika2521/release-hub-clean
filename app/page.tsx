"use client";

import { useEffect, useState } from "react";
import "chart.js/auto";
import { Pie } from "react-chartjs-2";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/analyze")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const total = data.total || 1;

  const percentClosed = Math.round((data.closed / total) * 100);
  const percentOpen = Math.round((data.open / total) * 100);
  const percentBlocked = Math.round((data.blocked / total) * 100);

  const pieData = {
    labels: ["Closed", "Open", "Blocked"],
    datasets: [
      {
