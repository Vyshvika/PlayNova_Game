export const exportJSON = (data: any, filename: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
  
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };
  
  export const exportCSV = (baseline: any, agent: any) => {
    const headers = Object.keys(baseline);
    const rows = headers.map(
      key => `${key},${baseline[key]},${agent[key]}`
    );
  
    const csv = `Metric,Baseline,AgentX\n${rows.join('\n')}`;
  
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'comparison.csv';
    link.click();
  };
  