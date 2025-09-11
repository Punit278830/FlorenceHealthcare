using System;
using TimeZoneConverter;
namespace hospitalApiProject.Services.Shared
{
  
  public static class TimeZoneHelper
  {
    public static DateTime ConvertToUtc(DateTime localTime, string timeZoneId)
    {
      // Convert IANA ("Asia/Kolkata") or Windows ("India Standard Time") to TimeZoneInfo
      TimeZoneInfo tz;
      try
      {
        tz = TZConvert.GetTimeZoneInfo(timeZoneId); // cross-platform safe
      }
      catch
      {
        tz = TimeZoneInfo.Utc; // fallback
      }

      // Convert local -> UTC
      return TimeZoneInfo.ConvertTimeToUtc(localTime, tz);
    }
  }
}
