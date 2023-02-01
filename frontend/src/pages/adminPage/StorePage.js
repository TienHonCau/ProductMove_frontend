import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Stack } from '@mui/material';
// components
// mock

import TableAgency from '../../sections/@admin/storage/TableAgency';
import TableFactory from '../../sections/@admin/storage/TableFactory';
import TableGuarantee from '../../sections/@admin/storage/TableGuarantee';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function StorePage() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Helmet>
        <title> Store | ProductionMove </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Quản lý kho
          </Typography>
        </Stack>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Đại lý" {...a11yProps(0)} />
              <Tab label="Cơ sở sản xuất" {...a11yProps(1)} />
              <Tab label="Trung tâm bảo hành" {...a11yProps(2)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <TableAgency />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableFactory />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TableGuarantee />
          </TabPanel>
        </Box>
      </Container>
    </>
  );
}
