using System;
using TimeZoneConverter;

namespace hospitalApiProject.Services.Shared
{
  public static class TimeZoneHelper
  {
    private static readonly string IstTimeZoneId = "Asia/Kolkata";

    /// <summary>
    /// Convert local time from any timezone to UTC
    /// </summary>
    /// <param name="localTime">Local time to convert</param>
    /// <param name="timeZoneId">Source timezone (IANA or Windows format)</param>
    /// <returns>UTC DateTime</returns>
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

    /// <summary>
    /// Convert IST time to UTC
    /// </summary>
    /// <param name="istTime">IST time to convert</param>
    /// <returns>UTC DateTime</returns>
    public static DateTime ConvertIstToUtc(DateTime istTime)
    {
      return ConvertToUtc(istTime, IstTimeZoneId);
    }

    /// <summary>
    /// Convert UTC time to IST
    /// </summary>
    /// <param name="utcTime">UTC time to convert</param>
    /// <returns>IST DateTime</returns>
    public static DateTime ConvertUtcToIst(DateTime utcTime)
    {
      TimeZoneInfo istTimeZone;
      try
      {
        istTimeZone = TZConvert.GetTimeZoneInfo(IstTimeZoneId);
      }
      catch
      {
        // Fallback to UTC if IST timezone is not available
        return utcTime;
      }

      return TimeZoneInfo.ConvertTimeFromUtc(utcTime, istTimeZone);
    }

    /// <summary>
    /// Convert from any timezone to IST
    /// </summary>
    /// <param name="sourceTime">Source time</param>
    /// <param name="sourceTimeZoneId">Source timezone ID</param>
    /// <returns>IST DateTime</returns>
    public static DateTime ConvertToIst(DateTime sourceTime, string sourceTimeZoneId)
    {
      // First convert to UTC, then to IST
      var utcTime = ConvertToUtc(sourceTime, sourceTimeZoneId);
      return ConvertUtcToIst(utcTime);
    }

    /// <summary>
    /// Get current IST time
    /// </summary>
    /// <returns>Current time in IST</returns>
    public static DateTime GetCurrentIst()
    {
      return ConvertUtcToIst(DateTime.UtcNow);
    }

    /// <summary>
    /// Check if a DateTime is in UTC
    /// </summary>
    /// <param name="dateTime">DateTime to check</param>
    /// <returns>True if UTC, false otherwise</returns>
    public static bool IsUtc(DateTime dateTime)
    {
      return dateTime.Kind == DateTimeKind.Utc;
    }

    /// <summary>
    /// Ensure DateTime is in UTC format
    /// </summary>
    /// <param name="dateTime">DateTime to ensure is UTC</param>
    /// <param name="sourceTimeZoneId">Source timezone if not already UTC</param>
    /// <returns>UTC DateTime</returns>
    public static DateTime EnsureUtc(DateTime dateTime, string? sourceTimeZoneId = null)
    {
      if (IsUtc(dateTime))
      {
        return dateTime;
      }

      // If no source timezone provided, assume IST
      var timeZoneId = sourceTimeZoneId ?? IstTimeZoneId;
      return ConvertToUtc(dateTime, timeZoneId);
    }
  }
}
