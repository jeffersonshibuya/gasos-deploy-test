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
  { value: 'Appling', label: 'Appling' },
  { value: 'Atkinson', label: 'Atkinson' },
  { value: 'Bacon', label: 'Bacon' },
  { value: 'Baker', label: 'Baker' },
  { value: 'Baldwin', label: 'Baldwin' },
  { value: 'Banks', label: 'Banks' },
  { value: 'Barrow', label: 'Barrow' },
  { value: 'Bartow', label: 'Bartow' },
  { value: 'Ben Hill', label: 'Ben Hill' },
  { value: 'Berrien', label: 'Berrien' },
  { value: 'Bibb', label: 'Bibb' },
  { value: 'Bleckley', label: 'Bleckley' },
  { value: 'Brantley', label: 'Brantley' },
  { value: 'Brooks', label: 'Brooks' },
  { value: 'Bryan', label: 'Bryan' },
  { value: 'Bulloch', label: 'Bulloch' },
  { value: 'Burke', label: 'Burke' },
  { value: 'Butts', label: 'Butts' },
  { value: 'Calhoun', label: 'Calhoun' },
  { value: 'Camden', label: 'Camden' },
  { value: 'Candler', label: 'Candler' },
  { value: 'Carroll', label: 'Carroll' },
  { value: 'Catoosa', label: 'Catoosa' },
  { value: 'Charlton', label: 'Charlton' },
  { value: 'Chatham', label: 'Chatham' },
  { value: 'Chattahoochee', label: 'Chattahoochee' },
  { value: 'Chattooga', label: 'Chattooga' },
  { value: 'Cherokee', label: 'Cherokee' },
  { value: 'Clarke', label: 'Clarke' },
  { value: 'Clay', label: 'Clay' },
  { value: 'Clayton', label: 'Clayton' },
  { value: 'Clinch', label: 'Clinch' },
  { value: 'Cobb', label: 'Cobb' },
  { value: 'Coffee', label: 'Coffee' },
  { value: 'Colquitt', label: 'Colquitt' },
  { value: 'Columbia', label: 'Columbia' },
  { value: 'Cook', label: 'Cook' },
  { value: 'Coweta', label: 'Coweta' },
  { value: 'Crawford', label: 'Crawford' },
  { value: 'Crisp', label: 'Crisp' },
  { value: 'Dade', label: 'Dade' },
  { value: 'Dawson', label: 'Dawson' },
  { value: 'Decatur', label: 'Decatur' },
  { value: 'DeKalb', label: 'DeKalb' },
  { value: 'Dodge', label: 'Dodge' },
  { value: 'Dooly', label: 'Dooly' },
  { value: 'Dougherty', label: 'Dougherty' },
  { value: 'Douglas', label: 'Douglas' },
  { value: 'Early', label: 'Early' },
  { value: 'Echols', label: 'Echols' },
  { value: 'Effingham', label: 'Effingham' },
  { value: 'Elbert', label: 'Elbert' },
  { value: 'Emanuel', label: 'Emanuel' },
  { value: 'Evans', label: 'Evans' },
  { value: 'Fannin', label: 'Fannin' },
  { value: 'Fayette', label: 'Fayette' },
  { value: 'Floyd', label: 'Floyd' },
  { value: 'Forsyth', label: 'Forsyth' },
  { value: 'Franklin', label: 'Franklin' },
  { value: 'Fulton', label: 'Fulton' },
  { value: 'Gilmer', label: 'Gilmer' },
  { value: 'Glascock', label: 'Glascock' },
  { value: 'Glynn', label: 'Glynn' },
  { value: 'Gordon', label: 'Gordon' },
  { value: 'Grady', label: 'Grady' },
  { value: 'Greene', label: 'Greene' },
  { value: 'Gwinnett', label: 'Gwinnett' },
  { value: 'Habersham', label: 'Habersham' },
  { value: 'Hall', label: 'Hall' },
  { value: 'Hancock', label: 'Hancock' },
  { value: 'Haralson', label: 'Haralson' },
  { value: 'Harris', label: 'Harris' },
  { value: 'Hart', label: 'Hart' },
  { value: 'Heard', label: 'Heard' },
  { value: 'Henry', label: 'Henry' },
  { value: 'Houston', label: 'Houston' },
  { value: 'Irwin', label: 'Irwin' },
  { value: 'Jackson', label: 'Jackson' },
  { value: 'Jasper', label: 'Jasper' },
  { value: 'Jeff Davis', label: 'Jeff Davis' },
  { value: 'Jefferson', label: 'Jefferson' },
  { value: 'Jenkins', label: 'Jenkins' },
  { value: 'Johnson', label: 'Johnson' },
  { value: 'Jones', label: 'Jones' },
  { value: 'Lamar', label: 'Lamar' },
  { value: 'Lanier', label: 'Lanier' },
  { value: 'Laurens', label: 'Laurens' },
  { value: 'Lee', label: 'Lee' },
  { value: 'Liberty', label: 'Liberty' },
  { value: 'Lincoln', label: 'Lincoln' },
  { value: 'Long', label: 'Long' },
  { value: 'Lowndes', label: 'Lowndes' },
  { value: 'Lumpkin', label: 'Lumpkin' },
  { value: 'Macon', label: 'Macon' },
  { value: 'Madison', label: 'Madison' },
  { value: 'Marion', label: 'Marion' },
  { value: 'McDuffie', label: 'McDuffie' },
  { value: 'McIntosh', label: 'McIntosh' },
  { value: 'Meriwether', label: 'Meriwether' },
  { value: 'Miller', label: 'Miller' },
  { value: 'Mitchell', label: 'Mitchell' },
  { value: 'Monroe', label: 'Monroe' },
  { value: 'Montgomery', label: 'Montgomery' },
  { value: 'Morgan', label: 'Morgan' },
  { value: 'Murray', label: 'Murray' },
  { value: 'Muscogee', label: 'Muscogee' },
  { value: 'Newton', label: 'Newton' },
  { value: 'Oconee', label: 'Oconee' },
  { value: 'Oglethorpe', label: 'Oglethorpe' },
  { value: 'Paulding', label: 'Paulding' },
  { value: 'Peach', label: 'Peach' },
  { value: 'Pickens', label: 'Pickens' },
  { value: 'Pierce', label: 'Pierce' },
  { value: 'Pike', label: 'Pike' },
  { value: 'Polk', label: 'Polk' },
  { value: 'Pulaski', label: 'Pulaski' },
  { value: 'Putnam', label: 'Putnam' },
  { value: 'Quitman', label: 'Quitman' },
  { value: 'Rabun', label: 'Rabun' },
  { value: 'Randolph', label: 'Randolph' },
  { value: 'Richmond', label: 'Richmond' },
  { value: 'Rockdale', label: 'Rockdale' },
  { value: 'Schley', label: 'Schley' },
  { value: 'Screven', label: 'Screven' },
  { value: 'Seminole', label: 'Seminole' },
  { value: 'Spalding', label: 'Spalding' },
  { value: 'Stephens', label: 'Stephens' },
  { value: 'Stewart', label: 'Stewart' },
  { value: 'Sumter', label: 'Sumter' },
  { value: 'Talbot', label: 'Talbot' },
  { value: 'Taliaferro', label: 'Taliaferro' },
  { value: 'Tattnall', label: 'Tattnall' },
  { value: 'Taylor', label: 'Taylor' },
  { value: 'Telfair', label: 'Telfair' },
  { value: 'Terrell', label: 'Terrell' },
  { value: 'Thomas', label: 'Thomas' },
  { value: 'Tift', label: 'Tift' },
  { value: 'Toombs', label: 'Toombs' },
  { value: 'Towns', label: 'Towns' },
  { value: 'Treutlen', label: 'Treutlen' },
  { value: 'Troup', label: 'Troup' },
  { value: 'Turner', label: 'Turner' },
  { value: 'Twiggs', label: 'Twiggs' },
  { value: 'Union', label: 'Union' },
  { value: 'Upson', label: 'Upson' },
  { value: 'Walker', label: 'Walker' },
  { value: 'Walton', label: 'Walton' },
  { value: 'Ware', label: 'Ware' },
  { value: 'Warren', label: 'Warren' },
  { value: 'Washington', label: 'Washington' },
  { value: 'Wayne', label: 'Wayne' },
  { value: 'Webster', label: 'Webster' },
  { value: 'Wheeler', label: 'Wheeler' },
  { value: 'White', label: 'White' },
  { value: 'Whitfield', label: 'Whitfield' },
  { value: 'Wilcox', label: 'Wilcox' },
  { value: 'Wilkes', label: 'Wilkes' },
  { value: 'Wilkinson', label: 'Wilkinson' },
  { value: 'Worth', label: 'Worth' }
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
