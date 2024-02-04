import { popularClassAPI, popularStudentAPI } from '../request/home';

export const popularClass = async summarizeLineData => {
  const currentDate = new Date();
  const endDate = currentDate.toISOString().split('T')[0] + 'T23:59:59Z';

  currentDate.setDate(currentDate.getDate() - 7);
  const startDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';

  return new Promise(async resolve => {
    const res = await popularClassAPI('2024-01-10T00:00:00Z', '2024-01-30T23:59:59Z');
    // const res = await popularClassAPI(startDate, endDate);

    res.data.sort((a, b) => b._count - a._count);
    res.data = res.data.slice(0, 6);
    res.data.forEach(item => {
      item.name = item.grade + item.class;
    });

    const y = res.data.map(item => item.name);
    const x = res.data.map(item => item._count);

    summarizeLineData.value = {
      categories: y,
      series: [{
        name: '总数',
        data: x,
      }],
    };

    resolve();
  });
};

export const popularStudent = async (personageAreaDataL, personageAreaDataR, stuInfo) => {
  const currentDate = new Date();
  const endDate = currentDate.toISOString().split('T')[0] + 'T23:59:59Z';

  currentDate.setDate(currentDate.getDate() - 7);
  const startDate = currentDate.toISOString().split('T')[0] + 'T00:00:00Z';

  return new Promise(async resolve => {
    const res = await popularStudentAPI('2024-01-10T00:00:00Z', '2024-01-30T23:59:59Z');
    // const res = await popularStudentAPI(startDate, endDate);
    const stuLCategories = [];
    const stuLData = [];
    const stuRCategories = [];
    const stuRData = [];

    stuInfo.value[0].count = res.data[0].reduce((total, cur) => total + cur._count, 0);
    stuInfo.value[1].count = res.data[1].reduce((total, cur) => total + cur._count, 0);
    for (const k of res.data[0]) {
      stuInfo.value[0].name = k.studentName;
      stuLCategories.push(k.courseName);
      stuLData.push(k._count);
    }

    for (const k of res.data[1]) {
      stuInfo.value[1].name = k.studentName;
      stuRCategories.push(k.courseName);
      stuRData.push(k._count);
    }

    personageAreaDataL.value = {
      categories: stuLCategories,
      series: [{
        name: '学生',
        data: stuLData,
      }],
    };

    personageAreaDataR.value = {
      categories: stuRCategories,
      series: [{
        name: '学生',
        data: stuRData,
      }],
    };

    resolve();
  });
};
