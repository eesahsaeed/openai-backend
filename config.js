module.exports = {
  aws_table_name: 'campaign-table',
  aws_local_config: {
    //Provide details for local configuration
  },
  aws_remote_config: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
  }
};