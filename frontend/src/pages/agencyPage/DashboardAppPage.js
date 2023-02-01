import React, { useState, useEffect } from 'react';

import { Helmet } from 'react-helmet-async';
import { faker } from '@faker-js/faker';
// @mui
import { Grid, Container, Typography, Paper } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import axios from 'axios';
// components
import Iconify from '../../components/iconify';
// sections
import {
  AppTasks,
  AppNewsUpdate,
  AppWebsiteVisits,
  AppTrafficBySite,
} from '../../sections/@agency/app';

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const [productMonth, setProductMonth] = useState([]);
  const [productQ, setProductQ] = useState([]);
  const getProductMonth = async () => {
    const response = await axios.get(`http://localhost:8000/agency/statistic-year/${sessionStorage.getItem('id')}`);
    setProductMonth(response.data);
  };
  useEffect(() => {
    getProductMonth();
  }, []);
  const getProductQ = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/agency/statistic-quarter/${sessionStorage.getItem('id')}`);
      setProductQ(response.data);
    } catch (err) {
      alert(err.message);
    }
  };
  useEffect(() => {
    getProductQ();
  }, []);

  const label = productMonth.map(p => p.month);
  const soldMonth = productMonth.map(p => p.sold);
  const errorMonth = productMonth.map(p => p.error);
  const series = [{
    name: 'Đã bán',
    data: productQ.map(a => a.sold)
  }];
  const options = {
    chart: {
      height: 350,
      type: 'bar',
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        dataLabels: {
          position: 'top', // top, center, bottom
        },
      }
    },
    dataLabels: {
      enabled: true,
      offsetY: -30,
      style: {
        fontSize: '20px',
        colors: ["#304758"]
      }
    },

    xaxis: {
      categories: ["Q1", "Q2", "Q3", "Q4"],
      position: 'top',
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      crosshairs: {
        fill: {
          type: 'gradient',
          gradient: {
            colorFrom: '#D8E3F0',
            colorTo: '#BED1E6',
            stops: [0, 100],
            opacityFrom: 0.4,
            opacityTo: 0.5,
          }
        }
      },
      tooltip: {
        enabled: true,
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: (val) => {
          return "".concat(val).concat(" sản phẩm");
        }
      }

    },
    title: {
      text: 'Thống kê sản phẩm bán ra theo quý năm 2022',
      floating: true,
      offsetY: 425,
      align: 'center',
      style: {
        color: '#444',
        fontSize: '18',
        fontFamily: 'Public Sans,sans-serif',
      }
    }
  }

  return (
    <>
      <Helmet>
        <title> Dashboard | ProductionMove </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={100}>

            <AppWebsiteVisits
              title="Thống kê sản phẩm tại đại lý năm 2022"
              chartLabels={label}
              chartData={[
                {
                  name: 'Đã bán',
                  type: 'line',
                  fill: 'solid',
                  data: soldMonth,
                },
                {
                  name: 'Lâu không bán được',
                  type: 'area',
                  fill: 'gradient',
                  data: errorMonth,
                },
              ]}
            />

          </Grid>

          <Grid item xs={12} md={6} lg={100}>
            <Paper>
              <ReactApexChart options={options} series={series} type="bar" height={450} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate
              title="News Update"
              list={[...Array(5)].map((_, index) => ({
                id: faker.datatype.uuid(),
                title: faker.name.jobTitle(),
                description: faker.name.jobTitle(),
                image: `/assets/images/covers/cover_${index + 1}.jpg`,
                postedAt: faker.date.recent(),
              }))}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite
              title="Traffic by Site"
              list={[
                {
                  name: 'FaceBook',
                  value: 323234,
                  icon: <Iconify icon={'eva:facebook-fill'} color="#1877F2" width={32} />,
                },
                {
                  name: 'Google',
                  value: 341212,
                  icon: <Iconify icon={'eva:google-fill'} color="#DF3E30" width={32} />,
                },
                {
                  name: 'Linkedin',
                  value: 411213,
                  icon: <Iconify icon={'eva:linkedin-fill'} color="#006097" width={32} />,
                },
                {
                  name: 'Twitter',
                  value: 443232,
                  icon: <Iconify icon={'eva:twitter-fill'} color="#1C9CEA" width={32} />,
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
