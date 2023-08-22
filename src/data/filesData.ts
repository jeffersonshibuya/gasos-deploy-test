import {
  CheckCircledIcon,
  CrossCircledIcon,
  UploadIcon,
  TimerIcon
} from '@radix-ui/react-icons';

export const electionTypes = [
  {
    value: 'Presidential Preference Primary',
    label: 'Presidential Preference Primary'
  },
  {
    value: 'Presidential Preference Primary and Special Election',
    label: 'Presidential Preference Primary and Special Election'
  },
  {
    value: 'General Primary and Nonpartisan Election',
    label: 'General Primary and Nonpartisan Election'
  },
  {
    value: 'General Primary and Nonpartisan Election Runoff',
    label: 'General Primary and Nonpartisan Election Runoff'
  },
  { value: 'General Election', label: 'General Election' },
  { value: 'General Election Runoff', label: 'General Election Runoff' },
  { value: 'Special Election', label: 'Special Election' },
  { value: 'Special Election Runoff', label: 'Special Election Runoff' },
  { value: 'General Municipal Election', label: 'General Municipal Election' },
  {
    value: 'General Municipal Election Runoff',
    label: 'General Municipal Election Runoff'
  }
];

export const years = () => {
  const currentYear = new Date().getFullYear();
  const options = [];
  for (let i = 0; i < 4; i++) {
    options.push({
      value: String(currentYear - i),
      label: String(currentYear - i)
    });
  }
  return options;
};

export const counties = [
  { value: 'Polk', label: 'Polk' },
  { value: 'Treutlen', label: 'Treutlen' },
  { value: 'Miller', label: 'Miller' },
  { value: 'Terrell', label: 'Terrell' },
  { value: 'Jeff Davis', label: 'Jeff Davis' },
  { value: 'White', label: 'White' },
  { value: 'Worth', label: 'Worth' },
  { value: 'Atkinson', label: 'Atkinson' },
  { value: 'Echols', label: 'Echols' },
  { value: 'Irwin', label: 'Irwin' },
  { value: 'Butts', label: 'Butts' },
  { value: 'Clarke', label: 'Clarke' },
  { value: 'Quitman', label: 'Quitman' },
  { value: 'Stephens', label: 'Stephens' },
  { value: 'Warren', label: 'Warren' },
  { value: 'Glascock', label: 'Glascock' },
  { value: 'Greene', label: 'Greene' },
  { value: 'Dade', label: 'Dade' },
  { value: 'Mitchell', label: 'Mitchell' },
  { value: 'Johnson', label: 'Johnson' },
  { value: 'Jenkins', label: 'Jenkins' },
  { value: 'Cobb', label: 'Cobb' },
  { value: 'Calhoun', label: 'Calhoun' },
  { value: 'Carroll', label: 'Carroll' },
  { value: 'Franklin', label: 'Franklin' },
  { value: 'Baker', label: 'Baker' },
  { value: 'Baldwin', label: 'Baldwin' },
  { value: 'Clayton', label: 'Clayton' },
  { value: 'Union', label: 'Union' },
  { value: 'Haralson', label: 'Haralson' },
  { value: 'Ben Hill', label: 'Ben Hill' },
  { value: 'Evans', label: 'Evans' },
  { value: 'Forsyth', label: 'Forsyth' },
  { value: 'Wilkes', label: 'Wilkes' },
  { value: 'Jasper', label: 'Jasper' },
  { value: 'Wayne', label: 'Wayne' },
  { value: 'Putnam', label: 'Putnam' },
  { value: 'Muscogee', label: 'Muscogee' },
  { value: 'Crisp', label: 'Crisp' },
  { value: 'Crawford', label: 'Crawford' },
  { value: 'Fannin', label: 'Fannin' },
  { value: 'Seminole', label: 'Seminole' },
  { value: 'Oconee', label: 'Oconee' },
  { value: 'Upson', label: 'Upson' },
  { value: 'Newton', label: 'Newton' },
  { value: 'Grady', label: 'Grady' },
  { value: 'Fulton', label: 'Fulton' },
  { value: 'Lee', label: 'Lee' },
  { value: 'Thomas', label: 'Thomas' },
  { value: 'Dawson', label: 'Dawson' },
  { value: 'Morgan', label: 'Morgan' },
  { value: 'Richmond', label: 'Richmond' },
  { value: 'Decatur', label: 'Decatur' },
  { value: 'Wilcox', label: 'Wilcox' },
  { value: 'Burke', label: 'Burke' },
  { value: 'Hart', label: 'Hart' },
  { value: 'Henry', label: 'Henry' },
  { value: 'Chatham', label: 'Chatham' },
  { value: 'Dodge', label: 'Dodge' },
  { value: 'Randolph', label: 'Randolph' },
  { value: 'Tattnall', label: 'Tattnall' },
  { value: 'Towns', label: 'Towns' },
  { value: 'Jones', label: 'Jones' },
  { value: 'Gwinnett', label: 'Gwinnett' },
  { value: 'Macon', label: 'Macon' },
  { value: 'Gordon', label: 'Gordon' },
  { value: 'Telfair', label: 'Telfair' },
  { value: 'Ware', label: 'Ware' },
  { value: 'Hancock', label: 'Hancock' },
  { value: 'Pulaski', label: 'Pulaski' },
  { value: 'Taylor', label: 'Taylor' },
  { value: 'Rockdale', label: 'Rockdale' },
  { value: 'Walker', label: 'Walker' },
  { value: 'Murray', label: 'Murray' },
  { value: 'Webster', label: 'Webster' },
  { value: 'Effingham', label: 'Effingham' },
  { value: 'Houston', label: 'Houston' },
  { value: 'Screven', label: 'Screven' },
  { value: 'Walton', label: 'Walton' },
  { value: 'McDuffie', label: 'McDuffie' },
  { value: 'Cherokee', label: 'Cherokee' },
  { value: 'Glynn', label: 'Glynn' },
  { value: 'Habersham', label: 'Habersham' },
  { value: 'Oglethorpe', label: 'Oglethorpe' },
  { value: 'Troup', label: 'Troup' },
  { value: 'Taliaferro', label: 'Taliaferro' },
  { value: 'Twiggs', label: 'Twiggs' },
  { value: 'Heard', label: 'Heard' },
  { value: 'Jefferson', label: 'Jefferson' },
  { value: 'Talbot', label: 'Talbot' },
  { value: 'Gilmer', label: 'Gilmer' },
  { value: 'Lanier', label: 'Lanier' },
  { value: 'DeKalb', label: 'DeKalb' },
  { value: 'Camden', label: 'Camden' },
  { value: 'Tift', label: 'Tift' },
  { value: 'Sumter', label: 'Sumter' },
  { value: 'Clay', label: 'Clay' },
  { value: 'Lincoln', label: 'Lincoln' },
  { value: 'Bibb', label: 'Bibb' },
  { value: 'Whitfield', label: 'Whitfield' },
  { value: 'Bryan', label: 'Bryan' },
  { value: 'Berrien', label: 'Berrien' },
  { value: 'Colquitt', label: 'Colquitt' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Emanuel', label: 'Emanuel' },
  { value: 'Banks', label: 'Banks' },
  { value: 'Lumpkin', label: 'Lumpkin' },
  { value: 'Monroe', label: 'Monroe' },
  { value: 'Columbia', label: 'Columbia' },
  { value: 'Harris', label: 'Harris' },
  { value: 'Washington', label: 'Washington' },
  { value: 'Wilkinson', label: 'Wilkinson' },
  { value: 'Toombs', label: 'Toombs' },
  { value: 'Dooly', label: 'Dooly' },
  { value: 'Lamar', label: 'Lamar' },
  { value: 'Liberty', label: 'Liberty' },
  { value: 'Meriwether', label: 'Meriwether' },
  { value: 'Bleckley', label: 'Bleckley' },
  { value: 'Pike', label: 'Pike' },
  { value: 'Stewart', label: 'Stewart' },
  { value: 'Bartow', label: 'Bartow' },
  { value: 'Spalding', label: 'Spalding' },
  { value: 'Floyd', label: 'Floyd' },
  { value: 'Wheeler', label: 'Wheeler' },
  { value: 'Early', label: 'Early' },
  { value: 'Chattahoochee', label: 'Chattahoochee' },
  { value: 'Montgomery', label: 'Montgomery' },
  { value: 'Laurens', label: 'Laurens' },
  { value: 'Chattooga', label: 'Chattooga' },
  { value: 'Clinch', label: 'Clinch' },
  { value: 'Cook', label: 'Cook' },
  { value: 'Long', label: 'Long' },
  { value: 'Jackson', label: 'Jackson' },
  { value: 'Peach', label: 'Peach' },
  { value: 'Bacon', label: 'Bacon' },
  { value: 'Schley', label: 'Schley' },
  { value: 'Brantley', label: 'Brantley' },
  { value: 'Elbert', label: 'Elbert' },
  { value: 'Dougherty', label: 'Dougherty' },
  { value: 'Bulloch', label: 'Bulloch' },
  { value: 'Fayette', label: 'Fayette' },
  { value: 'Pickens', label: 'Pickens' },
  { value: 'Coweta', label: 'Coweta' },
  { value: 'Lowndes', label: 'Lowndes' },
  { value: 'Madison', label: 'Madison' },
  { value: 'Douglas', label: 'Douglas' },
  { value: 'Candler', label: 'Candler' },
  { value: 'Catoosa', label: 'Catoosa' },
  { value: 'Brooks', label: 'Brooks' },
  { value: 'Turner', label: 'Turner' },
  { value: 'Barrow', label: 'Barrow' },
  { value: 'Paulding', label: 'Paulding' },
  { value: 'Pierce', label: 'Pierce' },
  { value: 'Marion', label: 'Marion' },
  { value: 'Charlton', label: 'Charlton' },
  { value: 'Appling', label: 'Appling' },
  { value: 'Hall', label: 'Hall' },
  { value: 'Rabun', label: 'Rabun' },
  { value: 'McIntosh', label: 'McIntosh' }
];

export const statuses = [
  {
    value: 'awaiting-approval',
    label: 'Awaiting-approval',
    icon: TimerIcon
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircledIcon
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: CrossCircledIcon
  }
];

export const countyStatuses = [
  {
    value: 'awaiting-approval',
    label: 'Awaiting-approval',
    icon: TimerIcon
  },
  {
    value: 'approved',
    label: 'Approved',
    icon: CheckCircledIcon
  },
  {
    value: 'rejected',
    label: 'Rejected',
    icon: CrossCircledIcon
  },
  {
    value: 'uploading',
    label: 'Uploading',
    icon: UploadIcon
  }
];
